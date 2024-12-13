import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Card,
  ResourceList,
  TextContainer,
  Layout,
  Text,
  Thumbnail,
} from "@shopify/polaris";
import "./Products.css"; // Import the CSS file
import { getProducts } from "app/server/products.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  const products = await getProducts({ request });
  return json({ products });
};

export default function Products() {
  const { products } = useLoaderData();

  return (
    <Page title="Products">
      <div className="product-list-container">
        <Layout>
          <Layout.Section>
            <Card title="Product List" sectioned>
              <ResourceList
                resourceName={{ singular: "product", plural: "products" }}
                items={products.edges.map(({ node }) => ({
                  id: node.id,
                  title: node.title,
                  handle: node.handle,
                  vendor: node.vendor,
                  description: node.description,
                  price: node.variants.edges[0]?.node.price,
                  imageUrl: node.images.edges[0]?.node.src,
                  altText:
                    node.images.edges[0]?.node.altText || "Product image",
                }))}
                renderItem={(item) => {
                  const {
                    id,
                    title,
                    handle,
                    vendor,
                    description,
                    price,
                    imageUrl,
                    altText,
                  } = item;
                  return (
                    <div key={id} className="product-item">
                      <Thumbnail
                        source={imageUrl}
                        alt={altText}
                        size="large"
                        className="product-thumbnail"
                      />
                      <TextContainer className="product-details">
                        <Text
                          as="h3"
                          variant="headingMd"
                          className="product-title"
                        >
                          {title}
                        </Text>
                        <p className="product-vendor">Vendor: {vendor}</p>
                        <p className="product-price">Price: ${price}</p>
                        <p className="product-description">{description}</p>
                        <p className="product-handle">Handle: {handle}</p>
                      </TextContainer>
                    </div>
                  );
                }}
              />
            </Card>
          </Layout.Section>
        </Layout>
      </div>
    </Page>
  );
}
