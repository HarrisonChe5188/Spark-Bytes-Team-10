import { POST } from "@/app/api/reservations/route";
import { createClient } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server");

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe("Reservations API", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: "user1" } },
          error: null,
        }),
      },
      from: jest.fn((table: string) => {
        const commonMock = {
          select: jest.fn().mockReturnThis(),
          insert: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
          update: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          delete: jest.fn().mockReturnThis(),
        };

        if (table === "posts") {
          return {
            ...commonMock,
            single: jest.fn().mockResolvedValue({
              data: { id: "post1", quantity_left: 5 },
              error: null,
            }),
          };
        }

        if (table === "reservations") {
          return {
            ...commonMock,
            single: jest.fn().mockResolvedValue({ data: null, error: null }),
          };
        }

        return commonMock;
      }),
    } as any);


  });

  it("POST returns 400 if post_id is missing", async () => {
    const mockRequest = { json: jest.fn().mockResolvedValue({}) } as any;
    const res = await POST(mockRequest);
    const json = res.body || res;
    expect(json).toHaveProperty("error", "post_id is required");
  });

  it("POST creates reservation successfully", async () => {
    const mockRequest = { json: jest.fn().mockResolvedValue({ post_id: "post1" }) } as any;
    const res = await POST(mockRequest);
    const json = res.body || res;
    expect(json).toHaveProperty("success", true);
  });
});
