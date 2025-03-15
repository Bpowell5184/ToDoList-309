const FRONTEND_URL = 'https://todolist-309.onrender.com';
const BACKEND_URL = 'https://backend-6hjp.onrender.com';

describe('Adding a new User', () => {
  context('GIVEN the SignUp Site is running properly', () => {
    it('THEN I should be able to Create an Account', () => {
      cy.visit(FRONTEND_URL + '/signup');
      cy.intercept('POST', BACKEND_URL + '/adduser').as('adduser');

      /*Enter Login Info & Create Account*/
      cy.get('input[placeholder="Enter new username"]').type(
        'CypressUItestuser',
      );
      cy.get('input[placeholder="Enter new password"]').type(
        'iLikeToMoveItMoveIt!3',
      );
      cy.get('input[placeholder="Enter your name"]').type('Cypress');
      cy.contains('Create Account').click();

      /*Verify an API call was made*/
      cy.wait('@adduser');
    });

    it("AND I shouldn't be able to Create an Account with a pre-existing username", () => {
      cy.visit(FRONTEND_URL + '/signup');
      cy.intercept('POST', BACKEND_URL + '/adduser', {
        statusCode: 400,
        body: { error: 'Error Adding User' },
      }).as('adduser');

      /*Enter Login Info & Create Account*/
      cy.get('input[placeholder="Enter new username"]').type(
        'CypressUItestuser',
      );
      cy.get('input[placeholder="Enter new password"]').type(
        'iLikeToMoveItMoveIt!3',
      );
      cy.get('input[placeholder="Enter your name"]').type('Cypress');
      cy.contains('Create Account').click();

      /*Verify an API call was made*/
      cy.wait('@adduser');

      cy.get('.error-message')
        .should('be.visible')
        .and('contain', 'An error occurred. Please try again.');
    });
  });
});

describe('Logging In as an Existing User', () => {
  context('GIVEN the Login Site is running properly', () => {
    it('THEN I should be able to Log In', () => {
      cy.visit(FRONTEND_URL + '/login');
      cy.intercept(BACKEND_URL + '/getuser').as('getuser');

      /*Enter Login Info & Create Account*/
      cy.get('input[placeholder="Enter your username"]').type(
        'CypressUItestuser',
      );
      cy.get('input[placeholder="Enter your password"]').type(
        'iLikeToMoveItMoveIt!3',
      );
      cy.get('button').contains('Log In').click();

      /*Verify an API call was made*/
      cy.wait('@getuser');
    });

    it("THEN I shouldn't be able to Log In without typing anything", () => {
      cy.visit(FRONTEND_URL + '/login');

      /*Don't Enter Login*/

      /*Click Log In*/
      cy.get('button').contains('Log In').click();

      /*Verify Error is shown*/
      cy.get('.error-message')
        .should('be.visible')
        .and('contain', 'Please enter a username and password.');
    });

    it("THEN I shouldn't be able to Log In with an invalid password", () => {
      cy.visit(FRONTEND_URL + '/login');
      cy.intercept(BACKEND_URL + '/getuser', {
        statusCode: 401,
      }).as('getuser');

      /*Enter Login Info & Create Account*/
      cy.get('input[placeholder="Enter your username"]').type(
        'CypressUItestuser',
      );
      cy.get('input[placeholder="Enter your password"]').type(
        'iLikeToMoveItMoveIt!3',
      );
      cy.get('button').contains('Log In').click();

      /*Verify an API call was made*/
      cy.wait('@getuser');

      /*Verify Error is shown*/
      cy.get('.error-message')
        .should('be.visible')
        .and('contain', 'Password not valid');
    });

    it("THEN I shouldn't be able to Log In with an nonexistant username", () => {
      cy.visit(FRONTEND_URL + '/login');
      cy.intercept(BACKEND_URL + '/getuser', {
        statusCode: 404,
      }).as('getuser');

      /*Enter Login Info & Create Account*/
      cy.get('input[placeholder="Enter your username"]').type(
        'CypressUItestuser',
      );
      cy.get('input[placeholder="Enter your password"]').type(
        'iLikeToMoveItMoveIt!3',
      );
      cy.get('button').contains('Log In').click();

      /*Verify an API call was made*/
      cy.wait('@getuser');

      /*Verify Error is shown*/
      cy.get('.error-message')
        .should('be.visible')
        .and('contain', 'Username not found');
    });
  });
});
