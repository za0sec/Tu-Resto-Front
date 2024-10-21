describe('Branches Page', () => {
    beforeEach(() => {
        // Asegúrate de usar la URL correcta para tu servidor local
        cy.visit('http://localhost:3000');
    });

    it('should display the landing page', () => {
        // Verifica que la página de inicio se cargue correctamente
        cy.url().should('eq', 'http://localhost:3000/');
        
        // Verifica que elementos clave de la landing page estén presentes
        cy.get('h1').should('be.visible');
        cy.get('nav').should('exist');
        cy.get('footer').should('exist');
    });
});
