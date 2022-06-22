/* eslint-disable no-param-reassign */
import FormData from 'form-data';
import { createReadStream, unlink } from 'fs';
import axios from 'axios';
import { BadRequestError } from 'routing-controllers';
import { UserRepository } from './user.repository';
import { ChangePasswordDto } from './dtos/changePassword.dto';
import { ChangeProfileDto } from './dtos/changeProfile.dto';
import { UserDocument } from './user.model';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserType } from './user-type.enum';
import { toSlugConverter } from '../helper/toSlugConverter';
import { CurrentUserOnRedisDocument } from './currentUserOnRedis.interface';

export class UserService {
  private readonly userRepository = new UserRepository();

  async createUser(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  async getUserByEmailAndRole(
    email: string,
    role: string,
  ): Promise<UserDocument> {
    if (role === 'client') return this.userRepository.getClientByEmail(email);
    return this.userRepository.getAdminByEmail(email);
  }

  async changePassword(user_id: string, changePasswordDto: ChangePasswordDto) {
    return this.userRepository.changePassword(user_id, changePasswordDto);
  }

  async changeProfile(
    user: CurrentUserOnRedisDocument,
    changeProfileDto: ChangeProfileDto,
    avatar: Express.Multer.File,
  ) {
    const user_id = user._id;
    const query = { _id: user_id, del_flag: false };
    if (avatar) {
      try {
        const form = new FormData();
        form.append('objectType', 'user');
        form.append('objectId', user_id.toString());
        form.append('file', createReadStream(avatar.path));
        form.append('type', 'avatar');
        const mediaResponse = await axios.post<string>(
          `${process.env.MEDIA_ROOT_URL}/file`,
          form,
          {
            headers: { ...form.getHeaders() },
          },
        );
        Object.assign(changeProfileDto, { avatar: mediaResponse.data });
      } catch (e) {
        throw new BadRequestError(e.message);
      } finally {
        unlink(avatar.path, () => null);
      }
    }
    if (
      changeProfileDto.skill &&
      changeProfileDto.skill.some((skill) => !skill.slug)
    ) {
      changeProfileDto.skill = changeProfileDto.skill.map((obj) => ({
        ...obj,
        slug: toSlugConverter(obj.name),
      })); // TODO : log new skills added by user to admins
    }
    if (user.type === UserType.CLIENT)
      return this.userRepository.changeClientProfile(query, changeProfileDto);
    return this.userRepository.changeAdminProfile(query, changeProfileDto);
  }

  async verifyActive(activeToken: string) {
    return this.userRepository.verifyActive(activeToken);
  }

  async sendResetPasswordRequest(user_email: string) {
    return this.userRepository.sendResetPasswordRequest(user_email);
  }

  async verifyActiveToken(active_token: string) {
    return this.userRepository.verifyActiveToken(active_token);
  }

  async resetPassword(
    active_token: string,
    resetPasswordDto: ResetPasswordDto,
  ) {
    return this.userRepository.resetPassword(active_token, resetPasswordDto);
  }
}
