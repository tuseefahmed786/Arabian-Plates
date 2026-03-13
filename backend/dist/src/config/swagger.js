"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const env_1 = require("./env");
const options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "UAE Number Plate Marketplace API",
            version: "1.0.0",
            description: "Backend API for premium UAE number plate marketplace",
        },
        servers: [
            {
                url: `http://localhost:${env_1.env.PORT}${env_1.env.API_PREFIX}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        paths: {
            "/health": {
                get: {
                    summary: "Health check",
                    responses: {
                        "200": { description: "API healthy" },
                    },
                },
            },
            "/auth/register": {
                post: { summary: "Register user", responses: { "201": { description: "User registered" } } },
            },
            "/auth/login": {
                post: { summary: "Login user", responses: { "200": { description: "Login success" } } },
            },
            "/listings": {
                get: { summary: "Get listings with filters", responses: { "200": { description: "Listings fetched" } } },
                post: {
                    summary: "Create listing",
                    security: [{ bearerAuth: [] }],
                    responses: { "201": { description: "Listing created" } },
                },
            },
            "/listings/featured": {
                get: { summary: "Get featured listings", responses: { "200": { description: "Featured listings" } } },
            },
            "/listings/trending": {
                get: { summary: "Get trending listings", responses: { "200": { description: "Trending listings" } } },
            },
            "/saved-listings": {
                get: {
                    summary: "Get saved listings",
                    security: [{ bearerAuth: [] }],
                    responses: { "200": { description: "Saved listings" } },
                },
                post: {
                    summary: "Save listing",
                    security: [{ bearerAuth: [] }],
                    responses: { "200": { description: "Listing saved" } },
                },
            },
            "/offers": {
                post: {
                    summary: "Make offer",
                    security: [{ bearerAuth: [] }],
                    responses: { "201": { description: "Offer created" } },
                },
            },
            "/inquiries": {
                post: {
                    summary: "Create inquiry",
                    security: [{ bearerAuth: [] }],
                    responses: { "201": { description: "Inquiry created" } },
                },
            },
            "/users/dashboard/seller": {
                get: {
                    summary: "Seller dashboard",
                    security: [{ bearerAuth: [] }],
                    responses: { "200": { description: "Seller dashboard data" } },
                },
            },
            "/admin/dashboard": {
                get: {
                    summary: "Admin dashboard",
                    security: [{ bearerAuth: [] }],
                    responses: { "200": { description: "Admin dashboard data" } },
                },
            },
        },
    },
    apis: [],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
