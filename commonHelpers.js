import{i as d,S as y}from"./assets/vendor-0fc460d7.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const s of t.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function i(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(e){if(e.ep)return;e.ep=!0;const t=i(e);fetch(e.href,t)}})();document.addEventListener("DOMContentLoaded",()=>{const l=document.getElementById("search-form"),o=l.querySelector('input[name="searchQuery"]'),i=l.querySelector('button[type="submit"]'),n=document.getElementById("gallery"),e=document.getElementById("load-more");let t=1,s="",u;o.addEventListener("input",()=>{o.value.trim()===""?i.disabled=!0:i.disabled=!1}),o.value.trim()===""&&(i.disabled=!0),l.addEventListener("submit",async p=>{p.preventDefault(),t=1,n.innerHTML="",s=o.value.trim(),await f()}),e.addEventListener("click",f);async function f(){const p="44455355-2a7bcc134ac57944b610f09f9",m=encodeURIComponent(s),g=`https://pixabay.com/api/?key=${p}&q=${m}&image_type=photo&orientation=horizontal&safesearch=true&page=${t}&per_page=40`;try{const a=await(await fetch(g)).json();if(t===1&&a.totalHits>0&&d.show({message:`Hooray! We found ${a.totalHits} images.`,position:"topRight",backgroundColor:"lightgreen",color:"white"}),a.hits.length===0){d.show({message:"Sorry, there are no images matching your search query. Please try again.",position:"topRight",backgroundColor:"lightcoral",color:"white"}),e.style.display="none";return}a.hits.forEach(r=>{const c=document.createElement("a");c.href=r.largeImageURL,c.className="photo-card",c.innerHTML=`
                    <img src="${r.webformatURL}" alt="${r.tags}" loading="lazy" />
                    <div class="info">
                        <p class="info-item"><b>Likes</b> ${r.likes}</p>
                        <p class="info-item"><b>Views</b> ${r.views}</p>
                        <p class="info-item"><b>Comments</b> ${r.comments}</p>
                        <p class="info-item"><b>Downloads</b> ${r.downloads}</p>
                    </div>
                `,n.appendChild(c)}),t+=1,e.style.display="block",u?u.refresh():u=new y(".gallery a"),a.totalHits<=t*40&&(e.style.display="none",d.show({message:"We're sorry, but you've reached the end of search results.",position:"topRight",backgroundColor:"lightcoral",color:"white"}))}catch(h){console.error("Error fetching images:",h),d.show({message:"An error occurred while fetching images. Please try again later.",position:"topRight",backgroundColor:"lightcoral",color:"white"})}}});
//# sourceMappingURL=commonHelpers.js.map
