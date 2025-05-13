import Home from './(landingpage)/page';

describe('<Home />', () => {
  it('mounts', () => {
    cy.mount(<Home />);
  });
});
