export default {
    async fetch(request, env) {
        const { pathname } = new URL(request.url);

        const headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://blinknote.pages.dev",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        };

        try {
            if (request.method === 'OPTIONS') {
                return new Response(null, { headers });
            }

            if (request.method === 'POST' && pathname === '/create') {
                const { message } = await request.json();
                const id = Math.random().toString(36).substr(2, 8);
                await env.MESSAGES.put(id, message);
                return new Response(JSON.stringify({ id }), { status: 200, headers });
            } else if (pathname.startsWith('/message/')) {
                const id = pathname.split('/')[2];
                const message = await env.MESSAGES.get(id);
                if (message) {
                    return new Response(JSON.stringify({ message }), { status: 200, headers });
                } else {
                    return new Response(JSON.stringify({ error: "Message not found or expired" }), { status: 404, headers });
                }
            } else {
                return new Response("BlinkNote - Not Found", { status: 404, headers });
            }
        } catch (error) {
            console.error("Error handling request:", error);
            return new Response(JSON.stringify({ error: "Server error occurred" }), { status: 500, headers });
        }
    }
};
