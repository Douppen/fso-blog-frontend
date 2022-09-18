describe("Blog app", () => {
  beforeEach(() => {
    cy.request("POST", "http://localhost:3001/api/testing/reset");
    const user = {
      name: "Test User",
      username: "testuser",
      password: "testpassword",
    };
    cy.request("POST", "http://localhost:3001/api/users/", user);
    cy.visit("http://localhost:3000");
  });

  it("login form is shown", () => {
    cy.contains("Log in to application");
    cy.contains("username");
    cy.contains("password");
  });

  describe("Login", () => {
    it("succeeds with correct credentials", () => {
      cy.get("#username").type("testuser");
      cy.get("#password").type("testpassword");
      cy.get("#login-btn").click();

      cy.contains("Logged in as testuser");
    });

    it("fails with wrong username", () => {
      cy.get("#username").type("thisusernamedoesnotexist1");
      cy.get("#password").type("wrong");
      cy.get("#login-btn").click();

      cy.contains("Username does not exist");
    });

    it("fails with wrong password", () => {
      cy.get("#username").type("testuser");
      cy.get("#password").type("wrong");
      cy.get("#login-btn").click();

      cy.contains("Wrong password");
    });
  });

  describe("When logged in", () => {
    beforeEach(() => {
      cy.login({ username: "testuser", password: "testpassword" });
    });

    it("a blog can be created and is shown", () => {
      cy.contains("create a blog").click();
      cy.get("#title").type("A blog created by cypress");
      cy.get("#author").type("Cypress");
      cy.get("#url").type("cypress.io");
      cy.get("#create-blog-btn").click();

      cy.contains("A blog created by cypress");
    });

    it("blogs are sorted by number of likes", () => {
      cy.createBlogRequest({
        title: "Blog with 3 likes",
        author: "Cypress",
        url: "cypress.io",
        likes: 3,
      });
      cy.createBlogRequest({
        title: "Blog with 4 likes",
        author: "Cypress",
        url: "cypress.io",
        likes: 4,
      });
      cy.createBlogRequest({
        title: "Blog with 10 likes",
        author: "Cypress",
        url: "cypress.io",
        likes: 10,
      });

      cy.visit("http://localhost:3000");

      cy.get(".blog").eq(0).should("contain", "Blog with 10 likes");
      cy.get(".blog").eq(1).should("contain", "Blog with 4 likes");
      cy.get(".blog").eq(2).should("contain", "Blog with 3 likes");
    });

    describe("when a blog exists", () => {
      beforeEach(() => {
        cy.createBlogRequest({
          title: "A blog created by cypress using backend API",
          author: "Cypress :)",
          url: "cypress.io",
        });
      });

      it("it can be liked", () => {
        cy.contains("show").click();
        cy.contains("like").click();

        cy.contains("1 likes");
      });

      it("it can be deleted and should not show", () => {
        cy.contains("show").click();
        cy.contains("delete").click();

        cy.get("html").should(
          "not.contain",
          "A blog created by cypress using backend API"
        );
      });

      it("it cannot be deleted by another user", () => {
        cy.contains("log out").click();
        const user = {
          name: "Another Tester",
          username: "anotheruser",
          password: "testpassword",
        };
        cy.request("POST", "http://localhost:3001/api/users/", user);
        cy.login({ username: "anotheruser", password: "testpassword" });
        cy.contains("Logged in as anotheruser");

        cy.contains("show").click();
        cy.get("html").should("not.contain", "delete");
      });
    });
  });
});
