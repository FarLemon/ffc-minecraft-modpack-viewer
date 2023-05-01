const CURSEFORGE_URL = import.meta.env.VITE_CURSEFORGE_API_URL;
const CURSEFORGE_KEY = import.meta.env.VITE_ETERNAL_API_KEY.replace(/\s/g, '');
const MODRINTH_URL = import.meta.env.VITE_MODRINTH_API_URL;

async function request<TResponse>(
  url: string,
  config: RequestInit
): Promise<TResponse> {
  const response = await fetch(url, config);
  return await response.json();
}
const api = {
  get: <TResponse>(url: string, config: RequestInit) => request<TResponse>(url, config),

  post: <TBody extends BodyInit, TResponse>(url: string, body: TBody) =>
  	request<TResponse>(url, { method: 'POST', body }),
}



// CurseForge Mod API Fetch Functions

export const curseforgeGetMods = async (modIDs: number[]) => {
  if (modIDs.length == 0) {return []}
  const inputBody = {"modIds": modIDs};

  const headers = {
    'Content-Type':'application/json',
    'Accept':'application/json',
    'x-api-key':CURSEFORGE_KEY
  };

  const result = await api.get(`${CURSEFORGE_URL}/v1/mods`,
  {
    method: 'POST',
    body: JSON.stringify(inputBody),
    headers: headers
  })

  return result["data"];
}



// Modrinth Mod API Fetch Functions

export const modrinthGetMods = async (modIDs: string[]) => {
  if (modIDs.length == 0) {return []}
  const headers = {
    'Content-Type':'application/json',
    'Accept':'application/json'
  };

  const result = await api.get(`${MODRINTH_URL}projects?ids=${JSON.stringify(modIDs)}`,
  {
    method: 'GET',
    headers: headers
  })

  return result;
}

export const modrinthGetModMembers = async (modID: string) => {
  const headers = {
    'Content-Type':'application/json',
    'Accept':'application/json'
  };

  const result = await api.get(`${MODRINTH_URL}project/${modID}/members`,
  {
    method: 'GET',
    headers: headers
  })

  return result;
}