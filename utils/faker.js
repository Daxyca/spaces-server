import { faker } from "@faker-js/faker";

export function createRandomUser() {
  const sex = faker.person.sexType();
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName();
  const uuid = faker.string.uuid();
  const email =
    uuid.slice(0, 8) + faker.internet.email({ firstName, lastName });
  const password = faker.internet.password();
  const username = (firstName + lastName).replace(" ", "") + uuid.slice(0, 4);
  const sexAtBirth = sex[0].toUpperCase() + sex.slice(1);

  return {
    username,
    password,
    email,
    profile: {
      birthDate: faker.date.birthdate(),
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      sexAtBirth,
    },
  };
}
