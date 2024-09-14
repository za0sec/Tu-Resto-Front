import { useState, useEffect } from 'react';
import EmployeeNavbar from '../components/EmployeeNavbar';
import { useRouter } from 'next/router'; // Para obtener el ID de la URL
import apiClient from '../utils/apiClient';
import OrderItemDialog from '../components/OrderItemCreationDialog';
import CategorySidebar from '../components/CategorySidebar';
import OrderCreationPreview from '../components/OrderCreationPreview';
import ProductList from '../components/OrderCreationProductList';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export default function EditOrder() {
    const router = useRouter();
    const { id: orderId } = router.query;

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [additionalComments, setAdditionalComments] = useState('');
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [order, setOrder] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [restaurantId, setRestaurantId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setRestaurantId(decodedToken.restaurant_id);
            } catch (error) {
                console.error('Error al decodificar el token:', error);
                setError('Error al obtener la información del restaurante');
            }
        } else {
            setError('No se encontró el token de acceso');
        }
    }, []);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await apiClient.get(`order/takeaway/${orderId}`);
                if (response.status === 200) {
                    setOrder(response.data.order_items);
                } else {
                    setError('Error al obtener los datos de la orden');
                }
            } catch (error) {
                console.error('Error al obtener los datos de la orden:', error);
                setError('Error al obtener los datos de la orden');
            }
        };

        if (orderId) {
            fetchOrderData();
        }
    }, [orderId]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                if (restaurantId) {
                    const response = await apiClient.get(`/restaurant/${restaurantId}/categories`);
                    if (response.status === 200) {
                        setCategories(response.data);
                    } else {
                        setError('Error al obtener las categorías');
                    }
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Error al obtener las categorías');
            }
        };

        fetchCategories();
    }, [restaurantId]);

    const handleCategoryClick = async (category) => {
        setSelectedCategory(category);
        try {
            if (restaurantId) {
                const response = await apiClient.get(`/restaurant/${restaurantId}/category/${category.id}`);
                if (response.status === 200) {
                    setProducts(response.data.products);
                } else {
                    setError('Error al obtener los productos');
                }
            }
        } catch (error) {
            console.error('Error fetching products for category:', error);
            setError('Error al obtener los productos');
        }
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setSelectedItem(null);  // Limpia cualquier item seleccionado
        setQuantity(1);
        setSelectedExtras([]);
        setAdditionalComments('');
        setIsDialogOpen(true);
    };

    const handleExtraToggle = (extra) => {
        const existingExtra = selectedExtras.find(e => e.name === extra.name);
        if (existingExtra) {
            setSelectedExtras(selectedExtras.filter(e => e.name !== extra.name));
        } else {
            setSelectedExtras([...selectedExtras, { ...extra, quantity: 1 }]);
        }
    };

    const handleExtraQuantity = (extra, action) => {
        setSelectedExtras(selectedExtras.map(e => {
            if (e.name === extra.name) {
                return {
                    ...e,
                    quantity: action === 'increase' ? e.quantity + 1 : Math.max(0, e.quantity - 1)
                };
            }
            return e;
        }));
    };

    const handleEditItem = (index) => {
        // Edita un item existente
        const itemToEdit = order[index];
        setSelectedItem(itemToEdit);
        setSelectedProduct(itemToEdit.product);
        setQuantity(itemToEdit.quantity);
        setSelectedExtras(itemToEdit.extras);
        setAdditionalComments(itemToEdit.comments);
        setEditingIndex(index);
        setIsDialogOpen(true);
    };

    const handleDeleteItem = (index) => {
        setOrder(order.filter((_, i) => i !== index));
    };

    const handleSaveOrder = async () => {
        try {
            const data = {
                order_items: order.map(item => ({
                    product: item.product.id,
                    quantity: item.quantity,
                    comments: item.comments || '',
                    extras: item.extras.map(extra => ({
                        id: extra.id,
                        quantity: extra.quantity
                    }))
                }))
            };

            const response = await apiClient.patch(`/order/takeaway/${orderId}`, JSON.stringify(data));

            if (response.status === 200 || response.status === 204) {
                router.push('/branchstaff/dashboard');
            }
        } catch (error) {
            console.error('Error al actualizar la orden:', error);
        }
    };

    const handleAddToOrder = () => {
        const newItem = {
            product: selectedProduct,
            quantity: quantity,
            extras: selectedExtras,
            comments: additionalComments,
        };

        if (editingIndex !== null) {
            const updatedOrder = [...order];
            updatedOrder[editingIndex] = newItem;
            setOrder(updatedOrder);
            setEditingIndex(null);
        } else {
            setOrder([...order, newItem]);
        }

        setQuantity(1);
        setSelectedExtras([]);
        setAdditionalComments('');
        setIsDialogOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <EmployeeNavbar />

            {/* Sidebar */}
            <div className="fixed top-0 left-0 w-64 h-screen bg-white shadow-md py-14">
                <CategorySidebar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryClick={handleCategoryClick}
                />
            </div>

            {/* Main Content Area */}
            <div className="flex-grow ml-64 p-6">
                <h1 className="text-3xl font-bold mb-8">Editar Orden</h1>
                <div className="flex flex-wrap">
                    <ProductList
                        selectedCategory={selectedCategory}
                        products={products}
                        selectedProduct={selectedProduct}
                        handleProductClick={handleProductClick}
                    />

                    <OrderCreationPreview
                        order={order}
                        handleEditItem={handleEditItem}
                        handleDeleteItem={handleDeleteItem}
                        handleSaveOrder={handleSaveOrder}
                    />
                </div>

                <OrderItemDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    item={selectedItem} // Pasa el item si existe
                    product={selectedProduct} // O el producto si no hay item
                    quantity={quantity}
                    setQuantity={setQuantity}
                    additionalComments={additionalComments}
                    setAdditionalComments={setAdditionalComments}
                    handleAddToOrder={handleAddToOrder}
                    editingIndex={editingIndex}
                />
            </div>
        </div>
    );
}
