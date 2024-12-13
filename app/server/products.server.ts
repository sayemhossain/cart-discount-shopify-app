import { authenticate } from "../shopify.server";

export const getProducts = async ({ request: any }) => {
  const { admin } = await authenticate.admin(request);
  console.log("Fetching products...");

  const response = await admin.graphql(
    `#graphql
      query {
        products(first: 10) {
          edges {
            node {
              id
              title
              vendor
              description
              images(first: 1) {
                edges {
                  node {
                    src
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    price
                  }
                }
              }
            }
            cursor
          }
          pageInfo {
            hasNextPage
          }
        }
      }`,
  );

  const data = await response.json();
  if (data.errors) {
    console.error("GraphQL errors:", data.errors);
    throw new Error("Failed to fetch products.");
  }

  // Extract and format the products data
  const products = data.data.products.edges.map((edge) => {
    const product = edge.node;

    // Extract the first image's `src` and `altText` if available
    const image = product.images.edges[0]?.node || { src: null, altText: null };

    // Extract the first variant's `price` if available
    const variant = product.variants.edges[0]?.node || { price: null };

    // Return a simplified product object
    return {
      id: product.id,
      title: product.title,
      vendor: product.vendor,
      description: product.description,
      image: {
        src: image.src,
        altText: image.altText,
      },
      price: variant.price,
    };
  });

  console.log("Products:", products);
  return products;
};
