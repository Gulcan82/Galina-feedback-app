// hello_world.js
export async function handler(event) {
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello, world!'),
    };
    return response;
}
