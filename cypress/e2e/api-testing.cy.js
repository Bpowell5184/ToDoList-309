const BACKEND_URL = 'https://backend-6hjp.onrender.com';

describe('Backend (REST API) is listening', () => {
  context('Backend loads and runs successfully', () => {
    before(() => {});
  });
  it('GIVEN I run backend', () => {});

  it('WHEN I visit root (/) end point', () => {
    cy.request(BACKEND_URL + '/').then((response) => {
      assert.isNotNull(response.body, 'THEN ');
      assert.equal(
        response.body,
        'Welcome to the Backend',
        'AND returns the correct body text',
      );
      assert.equal(
        response.status,
        200,
        'AND the response code is successful (200)!',
      );
    });
  });
});

describe('API POSTs, GETs, DELETEs a User from the DB', () => {
  context('Successful Post', () => {
    before(() => {});

    let user = {};
    let userId;

    it('GIVEN User obj has valid attributes', () => {
      user = {
        username: 'cypressAPItestuser',
        name: 'Cypress',
        password: 'iLikeToMoveItMoveIt!3',
      };
    });

    it('WHEN I attempt to POST a new user', () => {
      cy.request('POST', BACKEND_URL + '/adduser', user).then((response) => {
        assert.equal(
          response.status,
          201,
          'THEN I recieve a successful response (201)',
        );
        assert.equal(
          response.body.user.username,
          user.username,
          'AND response contains user info',
        );
        assert.equal(
          response.body.user.name,
          user.name,
          'AND response contains user info',
        );
        assert.exists(
          response.body.user._id,
          'AND response contains user info',
        );
        userId = response.body.user._id;
      });
    });

    it('WHEN I attempt to GET an existing User', () => {
      cy.request('POST', BACKEND_URL + '/getuser', {
        username: user.username,
        password: user.password,
      }).then((response) => {
        assert.equal(response.status, 200, 'THEN the get call was successful');
        assert.equal(
          response.body.user.username,
          user.username,
          'AND the username is correct',
        );
        assert.equal(
          response.body.user.name,
          user.name,
          'AND the name is correct',
        );
        assert.exists(response.body.user._id, 'AND ID exists');
      });
    });

    it('WHEN I attempt to DELETE an existing User', () => {
      cy.request('DELETE', BACKEND_URL + '/deleteuser/' + userId).then(
        (response) => {
          assert.equal(
            response.status,
            200,
            'THEN the user is deleted successfully',
          );
          assert.equal(
            response.body.user.username,
            user.username,
            "AND I DELETE'd the correct user",
          );
          assert.equal(
            response.body.user.name,
            user.name,
            "AND I DELETE'd the correct user",
          );
        },
      );
    });
  });
});
