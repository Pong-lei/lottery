

//颜色
const rgba = "0,0,0";
//透明度
const opacity = () => 0.3 || Math.random() * 0.7 + 0.25;
export const atmosphereGroupCard = () => `rgba(${rgba},${opacity()})`;


/**
 * 创建元素
 */
function createElement(css, text) {
  let dom = document.createElement("div");
  dom.className = css || "";
  dom.innerHTML = text || "";
  return dom;
}

export function createCard(user, isBold, id, showTable,COMPANY) {
 var element = createElement();
 element.id = "card-" + id;

 if (isBold) {
   element.className = "element lightitem";

   if (showTable) {
     element.classList.add("highlight");
   }
   //feat@刷新后不显示默认背景色
   element.style.backgroundColor = atmosphereGroupCard()
 } else {
   element.className = "element";
   element.style.backgroundColor = atmosphereGroupCard()

 }
 //添加公司标识
 COMPANY && element.appendChild(createElement("company", COMPANY));

 if(user&&user.length > 0){
  element.appendChild(createElement("name", user[1]));
 }
 

 // element.appendChild(createElement("details", user[0] + "<br/>" + user[2]));
 return element;
}

export function changeCard(cardIndex, user, threeDCards,COMPANY) {
  if(!user||!user.length) return
  let card = threeDCards[cardIndex].element;
  const nameDom = `<div class="name">${user[1]
    }</div>`
  const companyDom = `<div class="company">${COMPANY}</div>`
  card.innerHTML = nameDom + (COMPANY ? companyDom : '');
}

export function removeHighlight() {
  document.querySelectorAll(".highlight").forEach(node => {
    node.classList.remove("highlight");
  });
}