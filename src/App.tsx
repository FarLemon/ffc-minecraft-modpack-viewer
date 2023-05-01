import { Component, For, Index, createResource, createSignal } from 'solid-js';
import { curseforgeGetMods, modrinthGetModMembers, modrinthGetMods } from './fetchers';

import "./app.css";
import { MODPACKS } from './assets/modpacks';



const App: Component = () => {
  const [modPack, setModPack]: any = createSignal();
  const [modPackData, setModPackData]: any = createSignal({
    "name": "Select a ModPack",
    "author": "",
    "mods": []
  });


  const updateModPackData = async (modPack: any) => {
    let modrinthMods = [];
    let curseforgeMods = [];

    for (const mod of modPack.mods) {
      if (mod.type == "modrinth") {modrinthMods.push(mod.id)}
      if (mod.type == "curseforge") {curseforgeMods.push(mod.id)}
    }

    const modrinthModsData: any = await modrinthGetMods(modrinthMods);
    const curseforgeModsData: any = await curseforgeGetMods(curseforgeMods);

    let tempModPackData = [];

    for (const mod of modrinthModsData) {
      let owner: any = await modrinthGetModMembers(mod.id);
      for (const member of owner) {if (member.role == "Owner") {owner = member.user}}
      tempModPackData.push({
        "name": mod.title,
        "id": mod.id,
        "owner": owner.username,
        "description": mod.description,
        "logo": mod.icon_url,
        "link": `https://modrinth.com/mod/${mod.id}`
      });
    }
    for (const mod of curseforgeModsData) {
      tempModPackData.push({
        "name": mod.name,
        "id": mod.id,
        "owner": mod.authors[0].name,
        "description": mod.summary,
        "logo": mod.logo.url,
        "link": mod.links.websiteUrl
      });
    }

    setModPackData({
      "name": modPack.name,
      "author": modPack.author,
      "mods": tempModPackData
    });
  };

  const [data] = createResource(modPack, updateModPackData);


  return (
    <div class="page__content">

      <div class="modpacks">
        <For each={MODPACKS}>{(MODPACK) =>
          <button class="modpacks__modpack" onClick={() => {setModPack(MODPACK)}}>{MODPACK.name}</button>
        }</For>
      </div>

      <div class="modpack">
        <h1 class="modpack__title">{modPackData().name}</h1>
        <h2 class="modpack__author">{modPackData().author == "" ? "" : "By: "}{modPackData().author}</h2>
      </div>

      <div class="mods">
        <For each={modPackData().mods}>{(mod) =>
        <div class="mods__mod">
          <img class="mods__mod__logo" src={mod.logo} height="100px" width="100px"/>
          <div class="mods__mod__title">
            <h1 class="mods__mod__title__name">{mod.name}</h1>
            <h2 class="mods__mod__title__author">By: <span>{mod.owner}</span></h2>
          </div>
          <p class="mods__mod__description">{mod.description}</p>
          <a class="mods__mod__button" href={mod.link} target="_blank"></a>
        </div>
        }</For>
      </div>
    </div>
  );
};

export default App;