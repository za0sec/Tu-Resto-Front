import Product from './Product'; // Asegúrate de importar el componente Product correctamente

export default function ProductList({ selectedCategory, products, selectedProduct, handleProductClick }) {
    return (
        <div className="w-full md:w-1/2 pr-4 mb-4">
            <h2 className="text-2xl font-semibold mb-4">Productos</h2>
            {selectedCategory && (
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">{selectedCategory.name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                        {products.map((product) => (
                            <Product
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                description={product.description}
                                price={product.price}
                                onClick={() => handleProductClick(product)}
                                isSelected={selectedProduct?.id === product.id}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
