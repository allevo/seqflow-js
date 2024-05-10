import {
	screen,
} from "@testing-library/dom";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { InMemoryRouter, start } from "seqflow-js";
import { afterAll, afterEach, beforeAll, expect, test } from "vitest";
import { Main } from "../src/Main";
import { CartDomain } from "../src/domains/cart";
import { ProductDomain } from "../src/domains/product";
import { UserDomain } from "../src/domains/user";

const server = setupServer(
	http.get("/users", () => {
		return HttpResponse.json([
			{
				address: {
					geolocation: {
						lat: "-37.3159",
						long: "81.1496",
					},
					city: "kilcoole",
					street: "new road",
					number: 7682,
					zipcode: "12926-3874",
				},
				id: 1,
				email: "john@gmail.com",
				username: "johnd",
				password: "m38rmF$",
				name: {
					firstname: "john",
					lastname: "doe",
				},
				phone: "1-570-236-7033",
				__v: 0,
			},
		]);
	}),
	http.get("/products/categories", () => {
		return HttpResponse.json([
			"electronics",
			"jewelery",
			"men's clothing",
			"women's clothing",
		]);
	}),
	http.get("/products/category/electronics", () => {
		return HttpResponse.json([
			{
				id: 9,
				title: "WD 2TB Elements Portable External Hard Drive - USB 3.0 ",
				price: 64,
				description:
					"USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system",
				category: "electronics",
				image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
				rating: { rate: 3.3, count: 203 },
			},
			{
				id: 10,
				title: "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
				price: 109,
				description:
					"Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5” hard drive; Based on published specifications and internal benchmarking tests using PCMark vantage scores) Boosts burst write performance, making it ideal for typical PC workloads The perfect balance of performance and reliability Read/write speeds of up to 535MB/s/450MB/s (Based on internal testing; Performance may vary depending upon drive capacity, host device, OS and application.)",
				category: "electronics",
				image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
				rating: { rate: 2.9, count: 470 },
			},
			{
				id: 11,
				title:
					"Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5",
				price: 109,
				description:
					"3D NAND flash are applied to deliver high transfer speeds Remarkable transfer speeds that enable faster bootup and improved overall system performance. The advanced SLC Cache Technology allows performance boost and longer lifespan 7mm slim design suitable for Ultrabooks and Ultra-slim notebooks. Supports TRIM command, Garbage Collection technology, RAID, and ECC (Error Checking & Correction) to provide the optimized performance and enhanced reliability.",
				category: "electronics",
				image: "https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg",
				rating: { rate: 4.8, count: 319 },
			},
			{
				id: 12,
				title:
					"WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive",
				price: 114,
				description:
					"Expand your PS4 gaming experience, Play anywhere Fast and easy, setup Sleek design with high capacity, 3-year manufacturer's limited warranty",
				category: "electronics",
				image: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg",
				rating: { rate: 4.8, count: 400 },
			},
			{
				id: 13,
				title:
					"Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin",
				price: 599,
				description:
					"21. 5 inches Full HD (1920 x 1080) widescreen IPS display And Radeon free Sync technology. No compatibility for VESA Mount Refresh Rate: 75Hz - Using HDMI port Zero-frame design | ultra-thin | 4ms response time | IPS panel Aspect ratio - 16: 9. Color Supported - 16. 7 million colors. Brightness - 250 nit Tilt angle -5 degree to 15 degree. Horizontal viewing angle-178 degree. Vertical viewing angle-178 degree 75 hertz",
				category: "electronics",
				image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
				rating: { rate: 2.9, count: 250 },
			},
			{
				id: 14,
				title:
					"Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED ",
				price: 999.99,
				description:
					"49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side QUANTUM DOT (QLED) TECHNOLOGY, HDR support and factory calibration provides stunningly realistic and accurate color and contrast 144HZ HIGH REFRESH RATE and 1ms ultra fast response time work to eliminate motion blur, ghosting, and reduce input lag",
				category: "electronics",
				image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg",
				rating: { rate: 2.2, count: 140 },
			},
		]);
	}),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("The user should buy products", async () => {
	const router = new InMemoryRouter(new EventTarget(), "/");
	start(document.body, Main, undefined, {
		domains: {
			user: (eventTarget, _, config) => {
				return new UserDomain(eventTarget, config);
			},
			cart: (eventTarget, _, config) => {
				return new CartDomain(eventTarget);
			},
			product: (_1, _, config) => {
				return new ProductDomain(config);
			},
		},
		router,
		config: {
			api: {
				baseUrl: "",
			},
		},
	});

	const goToCheckoutTooltipBefore = await screen.findByText(/Go to checkout/i);
	expect(goToCheckoutTooltipBefore).not.toBeVisible();

	const electronicsCategory = await screen.findByText(/electronics/i);
	electronicsCategory.click();

	// Wait for the products to be rendered
	await screen.findByText(
		/WD 2TB Elements Portable External Hard Drive - USB 3.0/i,
	);

	const cartButtons = await screen.findAllByText(/Add to cart/i);
	expect(cartButtons).toHaveLength(6);
	// Add 2 products to the cart
	cartButtons[0].click();
	cartButtons[2].click();

	const goToCheckoutTooltipAfter = await screen.findByText(/Go to checkout/i);
	goToCheckoutTooltipAfter.click();

	// The user should see the total price
	await screen.findByText(/total: 173 €/i);

	const goToLoginButton = await screen.findByText(/Go to login/i);
	expect(goToLoginButton).toBeVisible();
	goToLoginButton.click();

	await screen.findByText(/login/i);

	const input: HTMLInputElement = await screen.findByLabelText(/username/i);
	input.value = "johnd";
	const loginButton = await screen.findByText(/login/i);
	loginButton.click();

	await screen.findByText(/electronics/i);

	const cartImage = await screen.findByTitle(/go to cart/i);
	cartImage.click();

	// The user should see the total price
	const total = await screen.findByText(/total: 173 €/i);
	expect(total).toBeVisible();

	const checkoutButton = await screen.findByRole("button", {
		name: /checkout/i,
	});
	checkoutButton.click();

	const goHomeLink = await screen.findByText(/Go home/i);
	goHomeLink.click();

	await screen.findByText(/electronics/i);
});
