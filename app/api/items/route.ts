export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getConfig() {
  const url = process.env.APPS_SCRIPT_URL;
  const token = process.env.APPS_SCRIPT_TOKEN;

  if (!url || !token) {
    return {
      ok: false as const,
      error:
        "APPS_SCRIPT_URL ou APPS_SCRIPT_TOKEN não configurado. Confira o arquivo .env.local e reinicie o npm run dev.",
    };
  }

  return {
    ok: true as const,
    url,
    token,
  };
}

async function readJsonSafe(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    const preview = text.replace(/\s+/g, " ").slice(0, 220);

    throw new Error(
      `A resposta não veio em JSON. Status: ${response.status}. Content-Type: ${contentType}. Início da resposta: ${preview}`
    );
  }
}

function jsonError(message: string, status = 500) {
  return Response.json(
    {
      ok: false,
      error: message,
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function GET() {
  try {
    const config = getConfig();

    if (!config.ok) {
      return jsonError(config.error, 500);
    }

    const endpoint = new URL(config.url);
    endpoint.searchParams.set("action", "listar");
    endpoint.searchParams.set("token", config.token);

    const response = await fetch(endpoint.toString(), {
      method: "GET",
      cache: "no-store",
      redirect: "follow",
      headers: {
        Accept: "application/json,text/plain,*/*",
      },
    });

    const json = await readJsonSafe(response);

    if (!response.ok || !json.ok) {
      return jsonError(json.error || "Erro retornado pelo Apps Script.", 500);
    }

    return Response.json(
      {
        ok: true,
        data: Array.isArray(json.data) ? json.data : [],
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Erro desconhecido ao listar itens.",
      500
    );
  }
}

async function salvarOuAtualizar(request: Request, action: "criar" | "atualizar") {
  try {
    const config = getConfig();

    if (!config.ok) {
      return jsonError(config.error, 500);
    }

    const body = await request.json();

    const endpoint = new URL(config.url);
    endpoint.searchParams.set("token", config.token);

    const response = await fetch(endpoint.toString(), {
      method: "POST",
      cache: "no-store",
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
        Accept: "application/json,text/plain,*/*",
      },
      body: JSON.stringify({
        action,
        item: body.item,
      }),
    });

    const json = await readJsonSafe(response);

    if (!response.ok || !json.ok) {
      return jsonError(json.error || "Erro retornado pelo Apps Script ao salvar.", 500);
    }

    return Response.json(
      {
        ok: true,
        data: json.data,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Erro desconhecido ao salvar item.",
      500
    );
  }
}

export async function POST(request: Request) {
  return salvarOuAtualizar(request, "criar");
}

export async function PUT(request: Request) {
  return salvarOuAtualizar(request, "atualizar");
}
