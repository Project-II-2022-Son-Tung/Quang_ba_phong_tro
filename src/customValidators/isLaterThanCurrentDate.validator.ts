import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function isLaterThanCurrentDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLaterThanCurrentDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value:Date, args: ValidationArguments) {
          return (new Date(value)).getTime() > (new Date()).getTime();
        },
      },
    });
  };
}
