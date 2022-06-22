import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function isNotLaterThan(
  numberOfMonth: number,
  validationOptions?: ValidationOptions,
) {
  return function IsNotLaterThanDecoratorProvider(
    object: unknown,
    propertyName: string,
  ) {
    registerDecorator({
      name: 'isNotLaterThan',
      target: object.constructor,
      propertyName,
      constraints: [numberOfMonth],
      options: validationOptions,
      validator: {
        validate(value: Date, args: ValidationArguments) {
          return (
            new Date(value).getTime() <=
            new Date(
              new Date().setMonth(new Date().getMonth() + numberOfMonth),
            ).getTime()
          );
        },
      },
    });
  };
}
