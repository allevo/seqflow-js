import { SeqflowFunctionContext } from "seqflow-js";
import { Product } from "../../product/ProductDomain";
import { Cart } from "../CartDomain";
import { ChangeCartEvent } from "../events";
import classes from "./CartProductList.module.css";

async function EmptyCart(this: SeqflowFunctionContext) {
	this.renderSync(<div>Cart is empty</div>);
}

export async function CartProduct(
	this: SeqflowFunctionContext,
	data: { product: Product; count: number; subTotal: number },
) {
	this.renderSync(
		<div className={classes.product} id={`cart-product-${data.product.id}`}>
			<div className={classes.left}>
				<img
					className={classes.productImage}
					src={data.product.image}
					alt={data.product.title}
				/>
				<div>{data.product.price} €</div>
			</div>
			<div className={classes.productTitle}>
				<p>{data.product.title}</p>
			</div>
			<div>x {data.count}</div>
			<div>= {data.subTotal} €</div>
			<button key="remove-from-cart" type="button" className="remove-from-cart">
				<i className="fa-solid fa-trash" />
			</button>
		</div>,
	);

	const events = this.waitEvents(this.domEvent("click", "remove-from-cart"));
	for await (const ev of events) {
		this.app.domains.cart.removeAllFromCart({ product: data.product });
	}
}

export async function CartProductList(
	this: SeqflowFunctionContext,
	data: { cart: Cart },
) {
	if (data.cart.products.length === 0) {
		this.renderSync(<EmptyCart />);
		return;
	}

	const checkoutButton = <button type="button">Checkout</button>;
	const cartLogin = <a href="/login">Go to login</a>;
	const cartTotal = (
		<div className={classes.cartTotal} id="cart-total">
			total: {data.cart.total} €
		</div>
	);
	this.renderSync(
		<div>
			<ul className={classes.cartProducts}>
				{data.cart.products.map(({ product, count, subTotal }) => {
					return (
						<li id={`cart-item-${product.id}`}>
							<CartProduct
								product={product}
								count={count}
								subTotal={subTotal}
							/>
						</li>
					);
				})}
			</ul>
			<hr />
			{cartTotal}
			<div className={classes.cartCheckout}>{checkoutButton}</div>
			<div>{cartLogin}</div>
		</div>,
	);

	const isLogged = this.app.domains.user.isLoggedIn();
	if (!isLogged) {
		checkoutButton.remove();
	} else {
		cartLogin.remove();
	}

	const events = this.waitEvents(
		this.domEvent("click", {
			el: this._el,
			preventDefault: true,
		}),
		this.domainEvent(ChangeCartEvent),
	);
	for await (const ev of events) {
		if (ev.target instanceof HTMLElement) {
			if (cartLogin.contains(ev.target)) {
				ev.preventDefault();
				this.app.router.navigate("/login");
				continue;
			}
			if (checkoutButton.contains(ev.target)) {
				ev.preventDefault();
				this.app.router.navigate("/checkout");
				continue;
			}
		}
		if (ev instanceof ChangeCartEvent) {
			switch (ev.detail.action) {
				case "remove-all-elements-of-a-product":
					this._el
						.querySelector(`li#cart-item-${ev.detail.product.id}`)
						?.remove();
					break;
				default:
					throw new Error("Unsupported action");
			}
			const cart = this.app.domains.cart.getCart();

			if (cart.products.length === 0) {
				this.renderSync(<EmptyCart />);
				break;
			}

			cartTotal.innerText = `total: ${cart.total} €`;
		}
	}
}
