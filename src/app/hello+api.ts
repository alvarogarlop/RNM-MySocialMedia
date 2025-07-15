export function GET(request: Request) {
  console.log("Hello world from api routes");

  return Response.json({ Hello: "world" });
}
