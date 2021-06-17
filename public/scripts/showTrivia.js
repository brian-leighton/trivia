const quizList = document.getElementById('list');

window.onload = async () => {
    // get list of quiz's from database
    let trivia = await axios.get('/get/trivia');
    // render list of quiz's from database
    renderList(trivia.data);
}

function createEle(element, text, classArr){
    const ele = document.createElement(element);
    ele.innerText = text;
    //check to see if a string is passed for the element classes
    if(!Array.isArray(classArr) && typeof classArr !== 'object'){
        ele.classList.add(classArr);
    } else if(Array.isArray(classArr)){
        for(let i = 0; i < classArr.length; i++){
            ele.classList.add(classArr[i]);
        }
    }
    return ele;
}

function renderList(list){
    for(let i = 0; i < list.length; i++){
        //main containers
        const li = createEle('li', '', 'list__item');
        const body = createEle('div', '', 'list__body');
        const info = createEle('div', '', 'list__body--info');
        const link = createEle('a', '>', []);
        link.href= `/trivia/${list[i].id}`;
        // create and add children
        body.appendChild(createEle('span', i + 1 , 'list__item--index'));
        info.appendChild(createEle('h3', list[i].title, ['heading', 'u-color-grey']));
        info.appendChild(createEle('h6', `${list[i].length} Questions - ${list[i].difficulty}`, 'u-color-primary'));
        body.appendChild(info);
        body.appendChild(link);
        li.appendChild(body);
        // ELEMENTS... assemble
        quizList.appendChild(li);
    }

}
