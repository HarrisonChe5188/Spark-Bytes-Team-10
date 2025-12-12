import { POST, PUT, DELETE } from "@/app/api/posts/route";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server");

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;
const mockCreateServiceClient = createServiceRoleClient as jest.MockedFunction<typeof createServiceRoleClient>;

describe("Posts API", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: "user1", app_metadata: {}, user_metadata: {} } },
          error: null,
        }),
      },
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { user_id: "user1", image_path: null, quantity_left: 5, total_quantity: 5 },
          error: null,
        }),
      })),
      storage: {
        from: jest.fn(() => ({
          upload: jest.fn().mockResolvedValue({ error: null }),
          remove: jest.fn().mockResolvedValue({ error: null }),
        })),
      },
    } as any);

    mockCreateServiceClient.mockReturnValue({
      from: jest.fn(() => ({
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { id: "post1" }, error: null }),
      })),
      storage: {
        from: jest.fn(() => ({
          upload: jest.fn().mockResolvedValue({ error: null }),
          remove: jest.fn().mockResolvedValue({ error: null }),
        })),
      },
    } as any);
  });

  const getMockFormData = () =>
    ({
      get: jest.fn((key: string) => {
        const data: Record<string, any> = {
          id: "post1",
          title: "Test Post",
          location: "NYC",
          campus_location: "BU Campus",
          description: "Test Description",
          quantity: "5",
          start_time: "2025-12-08T12:00:00Z",
          end_time: "2025-12-08T14:00:00Z",
          image: null,
          remove_image: "false",
        };
        return data[key];
      }),
    } as any);

  it("POST returns 400 if required fields are missing", async () => {
    const mockRequest = { formData: jest.fn().mockResolvedValue({ get: jest.fn(() => null) }) } as any;
    const res = await POST(mockRequest);
    const json = res.body || res;
    expect(json).toHaveProperty("error", "Missing required fields");
  });

  it("POST creates a post successfully", async () => {
    const mockRequest = { formData: jest.fn().mockResolvedValue(getMockFormData()) } as any;
    const res = await POST(mockRequest);
    const json = res.body || res;
    expect(json).toHaveProperty("success", true);
    expect(mockCreateClient).toHaveBeenCalled();
    expect(mockCreateServiceClient).toHaveBeenCalled();
  });

  it("PUT updates a post successfully", async () => {
    const mockRequest = { formData: jest.fn().mockResolvedValue(getMockFormData()) } as any;
    const res = await PUT(mockRequest);
    const json = res.body || res;
    expect(json).toHaveProperty("success", true);
  });

  it("DELETE deletes a post successfully", async () => {
    const url = "http://localhost:3000/api/posts?id=post1";
    const mockRequest = { url } as any;
    const res = await DELETE(mockRequest);
    const json = res.body || res;
    expect(json).toHaveProperty("success", true);
  });
});
