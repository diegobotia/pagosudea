import { Stripe} from 'stripe';
import ButtonCheckout from '../components/ButtonCheckout';

async function loadPrices(){
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const pricesData = await stripe.prices.list();
   
    //mapear los precios para incluir los nombres de los producto
    const pricesWithProductNames = await Promise.all(
        pricesData.data.map(async (price) =>{
            //Obtener los detalles del producto
            const product = await stripe.products.retrieve(price.product);
            return{
                id: price.id,
                unit_amount: price.unit_amount,
                currency: price.currency,
                productName: product.name,
            };
        })
    );
    return pricesWithProductNames;
}


async function PricingPage() {
    //Llamar a loadPrices para obtener los precios con los nombres de los productos
    const prices = await loadPrices();

    return (
        <div className="flex justify-center items-center h-screen">
           <div>
            <header><h1 className="text-center my-5">Pricing</h1></header>
            <div className="flex gap-x-2">
        {
            prices.map(price =>(
                <div key={price.id} className="bg-slate-300 mb-2">
                    <h3>{price.productName}</h3>
        <h2 className="text-3xl font-bold"><p>Precio: {(price.unit_amount / 100).toFixed(2)}
            {price.currency.toUpperCase()}
            </p></h2>
           
              <ButtonCheckout priceId ={price.id} />

            </div>
        ))}
        </div>
        </div>
        </div>
    );
    
}

export default PricingPage;