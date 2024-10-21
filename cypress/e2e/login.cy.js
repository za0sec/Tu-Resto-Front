describe('Login y Acceso al Dashboard', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');

        cy.contains('Ingresar').click();

        cy.get('input[placeholder="Nombre de Usuario"]').type('katiam');
        cy.get('input[placeholder="Contraseña"]').type('kachu');
        cy.get('button[type="submit"]').click();

    });

    it('debería mostrar el dashboard correctamente después del login', () => {
        
        cy.get('body').should('be.visible');
        
    });
});
