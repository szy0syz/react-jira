import { rest } from "msw";
import { http } from "utils/http";
import { setupServer } from "msw/node";

const apiUrl = process.env.REACT_APP_API_URL;

const server = setupServer();

// jest 是对 react 比较友好的一个测试库

// 代表所有测试之前，先来执行以下这个回调函数
beforeAll(() => server.listen());

// 每个测试跑完以后，都要重置以下 mock 路由
afterEach(() => server.resetHandlers());

// 所有测试跑完以后，关闭 mock 路由
afterAll(() => server.close());

test("http方法发送异步请求", async () => {
  const endpoint = "test-endpoint";
  const mockResult = { mockValue: "mock" };

  server.use(
    rest.get(`${apiUrl}/${endpoint}`, (req, res, ctx) =>
      res(ctx.json(mockResult))
    )
  );

  const result = await http(endpoint);

  expect(result).toEqual(mockResult);
});

test("htt[请求时会在header里带上token", async () => {
  const token = "FAKE_TOKEN";
  const endpoint = "test-endpotin";
  const mockResult = { mockValue: "mock" };

  let request: any;

  server.use(
    rest.get(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      request = req;

      return res(ctx.json(mockResult));
    })
  );

  await http(endpoint, {token});
  expect(request.headers.get("Authorization")).toBe(`Bearer ${token}`)
});
