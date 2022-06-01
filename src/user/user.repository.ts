/* eslint-disable @typescript-eslint/ban-types */
import { hashSync, compareSync } from 'bcrypt';
import { BadRequestError } from 'routing-controllers';
import { v4 as uuidv4 } from 'uuid';
import { UserDocument, UserModel } from './user.model';
import { ChangeProfileDto } from './dtos/changeProfile.dto';
import { ChangePasswordDto } from './dtos/changePassword.dto';
import { Mailer } from '../helper/mailer';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { UserStatus } from './user-status.enum';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserType } from './user-type.enum';
import { ClientModel } from '../clients/client.model';
import { AdminModel } from './admin.model';

export class UserRepository {
  private hashPassword(password: string, rounds: number): string {
    return hashSync(password, rounds);
  }

  private comparePassword(password: string, hashedPassword: string): boolean {
    return compareSync(password, hashedPassword);
  }

  async getClientByEmail(email: string): Promise<UserDocument | null> {
    return ClientModel.findOne({ email, del_flag: false })
      .select({
        active_token: 0,
      })
      .populate('category')
      .lean();
  }

  async getAdminByEmail(email: string): Promise<UserDocument | null> {
    return AdminModel.findOne({ email, del_flag: false }).lean();
  }

  async create(createUserDto: CreateUserDto): Promise<void> {
    const hashed_password = this.hashPassword(createUserDto.password, 10);
    const type = UserType.CLIENT;
    const del_flag = false;
    const status = UserStatus.NEW;
    const create_time = new Date();
    const active_token = uuidv4();
    const api_key = uuidv4();

    const user = new UserModel({
      ...createUserDto,
      hashed_password,
      type,
      del_flag,
      status,
      create_time,
      active_token,
      api_key,
    });
    const userCreated = await user.save();

    if (userCreated) {
      await Mailer.createNewUser(
        userCreated.email,
        userCreated.fullname,
        `${process.env.WEBSITE_DOMAIN_PATH}/user/verify/${userCreated.active_token}`,
      );
    }
  }

  async changeClientProfile(query: Object, changeProfileDto: ChangeProfileDto) {
    await ClientModel.findOneAndUpdate(query, { ...changeProfileDto }).exec();
  }

  async changeAdminProfile(query: Object, changeProfileDto: ChangeProfileDto) {
    await AdminModel.findOneAndUpdate(query, { ...changeProfileDto }).exec();
  }

  async verifyActive(active_token: string) {
    try {
      const user = await UserModel.findOneAndUpdate(
        {
          active_token,
          del_flag: false,
          type: 'client',
        },
        {
          status: UserStatus.ACTIVE,
          active_token: uuidv4(),
        },
      );
      if (!user) {
        throw new BadRequestError(
          'Activation unsuccesfully : invalid ActiveToken or user has been activated before! This error will also be thrown in the case that user has been deleted !',
        );
      }
      await Mailer.verifySucceed(user.email, user.fullname);
      return 'Kích hoạt tài khoản thành công';
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async changePassword(user_id: string, changePasswordDto: ChangePasswordDto) {
    const query = { _id: user_id, del_flag: false };
    const { old_password, new_password } = changePasswordDto;
    if (old_password === new_password) {
      throw new BadRequestError(
        'New Password must be different with Old Password',
      );
    } else {
      try {
        const new_hashed_password = this.hashPassword(
          changePasswordDto.new_password,
          10,
        );
        const user = await UserModel.findOne(query)
          .select({
            _id: 0,
            hashed_password: 1,
          })
          .lean();
        if (!this.comparePassword(old_password, user.hashed_password)) {
          throw new Error('Old Password is incorrect');
        } else {
          await UserModel.findOneAndUpdate(query, {
            hashed_password: new_hashed_password,
          });
        }
      } catch (e) {
        throw new BadRequestError(e.message);
      }
    }
  }

  async sendResetPasswordRequest(user_email: string) {
    const user = await UserModel.findOne({
      email: user_email,
      status: UserStatus.ACTIVE,
      del_flag: false,
    });
    if (!user) {
      throw new BadRequestError('User not found !');
    }
    const otp_active_token = uuidv4();
    user.active_token = otp_active_token;
    await user.save();
    await Mailer.resetPassword(user.email, user.fullname, otp_active_token);
  }

  async verifyActiveToken(active_token: string) {
    try {
      const user = await UserModel.findOne({
        active_token,
        del_flag: false,
        status: UserStatus.ACTIVE,
      });
      if (!user) {
        throw new BadRequestError(
          'This active_token does not exist or user does not exist !',
        );
      }
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async resetPassword(
    active_token: string,
    resetPasswordDto: ResetPasswordDto,
  ) {
    const user = await UserModel.findOne({
      active_token,
      del_flag: false,
      status: UserStatus.ACTIVE,
    });
    if (!user) {
      throw new BadRequestError(
        'This active_token does not exist or user does not exist !',
      );
    }
    const { new_password, confirm_new_password } = resetPasswordDto;
    if (new_password !== confirm_new_password) {
      throw new BadRequestError('Confirmation password must equal to password');
    }
    const new_hashed_password = this.hashPassword(new_password, 10);
    user.hashed_password = new_hashed_password;
    user.active_token = uuidv4();
    await user.save();
  }
}
