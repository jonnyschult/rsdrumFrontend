# R.S. Drum Studio - BackEnd

## App Description

This project is designed to enable R.S. Drum Studio to augment their in-person learning. It allows for:

- Currated video collections with titles and descriptions, searchable by tags
- Online payments through Stripe and retrievable payment history
- CRUD lesson packages for in person instruction options
- Full user CRUD
- Mailgun messages for propsective customers with hosted domain
- Lesson Creation with the following features:
  - Fully customizable by instructor
  - Assignable to particular students by instructor
  - Lesson descriptions
  - Assignments which contain instructions, music sheets, links to an instructor generated GrooveScribe (online drum software)
  - Comments which allow for student feedback and further instruction or clarifcation from the instructor with unread indicators
  - All lessons and assignments are CRUD-able

This project is hosted via AWS(DynamoDB, Elastic Beanstalk, Amplify, Route 53)

[R.S. Drum Studio production site](https://www.rsdrum.com)

## Backend

Go to [GitHub-rsdrumBackend](https://github.com/jonnyschult/rsdrumBackend) and follow the instructions in README

## Frontend

This app is built with React, so the starting up process is fairly straightforward.

- Move to the root directory of the project
- Run `npm install` or `yarn install`
- Run `npm start` or `yarn start`

If the backend is running and the admin user is created, you should have privileges to create lessons, assignments, add videos, create lesson packages and manage other users. Because the app requires environment variables associated with my account, you cannot create stripe payments or send a message from the contact forms.

[Create-React-App boilerplate](https://github.com/facebook/create-react-app/blob/main/packages/cra-template/template/README.md)
