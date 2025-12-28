/**
 * Schema.org Structured Data Markup
 * Virtual Mega Mall - SEO Enhancement
 * 
 * Implements JSON-LD structured data for better search engine visibility
 */

const SchemaMarkup = {
    // Organization Schema
    addOrganizationSchema() {
        const schema = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Virtual Mega Mall",
            "description": "Pakistan's first 3D virtual shopping mall - Shop from multiple brands in an immersive 3D experience",
            "url": "https://virtualmegamall.vercel.app",
            "logo": "https://virtualmegamall.vercel.app/logo.png",
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+92-XXX-XXXXXXX",
                "contactType": "customer service",
                "areaServed": "PK",
                "availableLanguage": ["English", "Urdu"]
            },
            "sameAs": [
                "https://facebook.com/virtualmegamall",
                "https://instagram.com/virtualmegamall",
                "https://twitter.com/virtualmegamall"
            ]
        };
        this._injectSchema(schema);
    },

    // Website Schema
    addWebsiteSchema() {
        const schema = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Virtual Mega Mall",
            "url": "https://virtualmegamall.vercel.app",
            "potentialAction": {
                "@type": "SearchAction",
                "target": "https://virtualmegamall.vercel.app/store.html?search={search_term_string}",
                "query-input": "required name=search_term_string"
            }
        };
        this._injectSchema(schema);
    },

    // Product Schema (for product pages)
    addProductSchema(product) {
        const schema = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "image": product.img,
            "description": product.description || `${product.name} from ${product.brand}`,
            "brand": {
                "@type": "Brand",
                "name": product.brand
            },
            "offers": {
                "@type": "Offer",
                "price": product.price.replace(/[^0-9]/g, ''),
                "priceCurrency": "PKR",
                "availability": "https://schema.org/InStock",
                "url": window.location.href
            }
        };
        if (product.rating) {
            schema.aggregateRating = {
                "@type": "AggregateRating",
                "ratingValue": product.rating,
                "reviewCount": product.reviewCount || 1
            };
        }
        this._injectSchema(schema);
    },

    // E-commerce Schema
    addEcommerceSchema() {
        const schema = {
            "@context": "https://schema.org",
            "@type": "Store",
            "name": "Virtual Mega Mall",
            "description": "Online marketplace with multiple vendors and brands",
            "url": "https://virtualmegamall.vercel.app",
            "image": "https://virtualmegamall.vercel.app/store-image.png",
            "priceRange": "PKR 500 - PKR 500,000",
            "paymentAccepted": "Cash, Credit Card, JazzCash, EasyPaisa, Stripe",
            "currenciesAccepted": "PKR"
        };
        this._injectSchema(schema);
    },

    // Breadcrumb Schema
    addBreadcrumbSchema(breadcrumbs) {
        const itemListElement = breadcrumbs.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }));

        const schema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": itemListElement
        };
        this._injectSchema(schema);
    },

    // Helper: Inject schema into document head
    _injectSchema(schema) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
    },

    // Auto-initialize based on page type
    init() {
        // Add organization schema to all pages
        this.addOrganizationSchema();
        this.addWebsiteSchema();

        // Add page-specific schemas
        const pathname = window.location.pathname;

        if (pathname.includes('store.html') || pathname === '/' || pathname.includes('index.html')) {
            this.addEcommerceSchema();
        }

        if (pathname.includes('product.html')) {
            // Product schema will be added when product data loads
            window.addEventListener('productLoaded', (e) => {
                this.addProductSchema(e.detail);
            });
        }
    }
};

// Auto-initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SchemaMarkup.init());
} else {
    SchemaMarkup.init();
}

// Export for manual use
window.SchemaMarkup = SchemaMarkup;
