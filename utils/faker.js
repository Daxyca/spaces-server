import { faker } from "@faker-js/faker";

export function randomUser() {
  const sex = faker.person.sexType();
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName();
  const uuid = faker.string.uuid();
  const email =
    uuid.slice(0, 8) + faker.internet.email({ firstName, lastName });
  const password = faker.internet.password();
  const username = (firstName + lastName).replace(" ");
  const bio = faker.lorem.paragraph();
  const sexAtBirth = sex[0].toUpperCase() + sex.slice(1);
  const location = faker.location.country();
  const picture = faker.image.avatar();
  console.log({ picture });

  return {
    username,
    password,
    email,
    profile: {
      displayName: firstName,
      bio,
      firstName,
      lastName,
      birthDate: faker.date.birthdate(),
      sexAtBirth,
      location,
      picture,
    },
  };
}

export function randomPostContent() {
  return faker.lorem.paragraphs(3);
}
