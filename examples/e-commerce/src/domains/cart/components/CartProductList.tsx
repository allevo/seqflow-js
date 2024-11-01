import { Alert, Button, Divider } from "@seqflow/components";
import { ComponentProps, Contexts } from "@seqflow/seqflow";
import type { Product } from "../../product";
import type { Cart } from "../CartDomain";
import { ChangeCartEvent } from "../events";
import classes from "./CartProductList.module.css";

async function EmptyCart(_: ComponentProps<unknown>, { component }: Contexts) {
	component.renderSync(<div>Cart is empty</div>);
}

export async function CartProduct(
	data: { product: Product; count: number; subTotal: number },
	{ component, app }: Contexts,
) {
	component._el.classList.add(classes.product);
	component._el.id = `cart-product-${data.product.id}`;
	component.renderSync(
		<>
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
			<Button color="ghost" key="remove-from-cart" type="button">
				<i className="fa-solid fa-trash" />
			</Button>
		</>,
	);

	const events = component.waitEvents(
		component.domEvent("remove-from-cart", "click"),
	);
	for await (const ev of events) {
		app.domains.cart.removeAllFromCart({ product: data.product });
	}
}

export async function CartProductList(
	data: { cart: Cart },
	{ component, app }: Contexts,
) {
	if (data.cart.products.length === 0) {
		component.renderSync(<EmptyCart />);
		return;
	}

	const checkoutButton = (
		<Button
			color="primary"
			key="remove-from-cart"
			type="button"
			className={"mt-4"}
		>
			Checkout
		</Button>
	) as HTMLElement;

	const cartLogin = (
		<Alert color="warning" className={"mt-4"} style={{ display: "block" }}>
			You have to log in to checkout. Click{" "}
			<a href="/login">here to go to login page</a>
		</Alert>
	) as HTMLElement;
	const cartTotal = (
		<div className={classes.cartTotal} id="cart-total">
			total: {data.cart.total} €
		</div>
	) as HTMLElement;
	component.renderSync(
		<>
			<ul className={classes.cartProducts}>
				{data.cart.products.map(({ product, count, subTotal }) => {
					return (
						<li key={product.id} id={`cart-item-${product.id}`}>
							<CartProduct
								product={product}
								count={count}
								subTotal={subTotal}
							/>
						</li>
					);
				})}
			</ul>
			<Divider />
			{cartTotal}
			<div className={classes.cartCheckout}>{checkoutButton}</div>
			<div>{cartLogin}</div>
		</>,
	);

	const isLogged = app.domains.user.isLoggedIn();
	if (!isLogged) {
		checkoutButton.remove();
	} else {
		cartLogin.remove();
	}

	const events = component.waitEvents(
		component.domEvent(component._el, "click", {
			preventDefault: true,
		}),
		component.domainEvent(ChangeCartEvent),
	);
	for await (const ev of events) {
		if (ev.target instanceof HTMLElement) {
			if (cartLogin.contains(ev.target)) {
				ev.preventDefault();
				app.router.navigate("/login");
				continue;
			}
			if (checkoutButton.contains(ev.target)) {
				ev.preventDefault();
				app.router.navigate("/checkout");
				continue;
			}
		}
		if (ev instanceof ChangeCartEvent) {
			switch (ev.detail.action) {
				case "remove-all-elements-of-a-product":
					component.replaceChild(ev.detail.product.id, () => <></>);
					break;
				default:
					app.log.error({
						message: "Unsupported action",
						data: ev,
					});
					throw new Error("Unsupported action");
			}
			const cart = app.domains.cart.getCart();

			if (cart.products.length === 0) {
				component.renderSync(<EmptyCart />);
				break;
			}

			cartTotal.innerText = `total: ${cart.total} €`;
		}
	}
}
