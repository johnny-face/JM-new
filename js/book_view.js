var xmlHttp = new XMLHttpRequest();
var serverURL = "localhost";

function xmlHttpRequest() {
    var URL = "http://" +serverURL+ ":8080/GetDateWithServlet?lanmuList";
    xmlHttp.open("GET", URL, false);
    xmlHttp.onreadystatechange = updatePage();
    xmlHttp.send(null);

}
//服务器XML文件解析
function updatePage() {
    var xmldoc;
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var response =xmlHttp.responseText;
        var parse = new DOMParser();
        xmldoc = parse.parseFromString(response,"text/xml");
        lanmuList(xmldoc);
    }
}
//获取栏目
function lanmuList(xmldoc) {
    var result = xmldoc.getElementsByTagName("list");
    var lanmu_list;
        for (var i=0; i<result.length; i++) {
            var get_name = result[i].getAttribute("name");
            var get_url = result[i].firstChild.nodeValue;
            lanmu_list = document.createElement("a");
            lanmu_list.setAttribute("class","selected");
            lanmu_list.setAttribute("href",get_url);
            var lanmu_name = document.createTextNode(get_name);
            lanmu_list.appendChild(lanmu_name);
            var li = document.createElement("li");
            li.setAttribute("class","class");
            li.appendChild(lanmu_list);
            var family = document.getElementById("class");
            family.appendChild(li);

            lanmu_list.onclick = function() {
                var get_lanmuurl = this.getAttribute("href");
                get_booklist(get_lanmuurl);
                //清空
                var family = document.getElementById("class");
                $(family).empty();
                //创建返回
                var return_list = document.getElementById("return_list");
                var back_family = document.createElement("a");
                var back_text = document.createTextNode("返回栏目");
                back_family.setAttribute("id","back");
                back_family.setAttribute("href","#return_list");
                back_family.appendChild(back_text);
                return_list.appendChild(back_family);
                 //创建书目列表翻页按钮
                var lastlist = document.createElement("a");
                var nextlist = document.createElement("a");
                var lasttext = document.createTextNode("上一页");
                var nexttext = document.createTextNode("下一页");
                lastlist.appendChild(lasttext);
                nextlist.appendChild(nexttext);
                lastlist.setAttribute("id","lastlist");
                lastlist.setAttribute("href","#book_list");
                nextlist.setAttribute("id","nextlist");
                nextlist.setAttribute("href","#book_list");
                $(lastlist).appendTo(return_list);
                $(nextlist).appendTo(return_list);
                return false;
            }
    }
}
//后台获取书名与解析xml文件
function get_booklist(get_bookurl) {
    var URL = "http://" +serverURL+ ":8080/GetDateWithServlet?bookList="+get_bookurl;
    xmlHttp.open("GET", URL, true);
    xmlHttp.onreadystatechange = get_bookupdate;
    xmlHttp.send(null);
}
function get_bookupdate() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var response =xmlHttp.responseText;
        var parse = new DOMParser();
        var xmldoc = parse.parseFromString(response,"text/xml");
        bookList(xmldoc);
    }
}

//获取书名并展示
function bookList(xmldoc) {
    var book_list = document.getElementById("book_list");
    var result = xmldoc.getElementsByTagName("list");
    for (var i=0; i<result.length; i++) {
        var get_bookname = result[i].getAttribute("name");
        var get_bookurl = result[i].firstChild.nodeValue;
        var bookname_list = document.createElement("a");
        var book_name = document.createTextNode(get_bookname);
        bookname_list.setAttribute("class","book_list_a");
        bookname_list.setAttribute("href", get_bookurl);
        bookname_list.appendChild(book_name);
        var li = document.createElement("li");
        li.setAttribute("class","book_list");
        li.appendChild(bookname_list);
        book_list.appendChild(li);

//点击阅读
        bookname_list.onclick = function() {
             //清空
            var first = document.getElementsByClassName("first");
            $(first).empty();
            var article = document.getElementById("article");
            $(article).empty();
            var chapter = document.getElementById("chapter");
            $(chapter).empty();
            var chaper_ul = document.getElementById("chaper_ul");
            $(chaper_ul).remove();
            var front_page = document.getElementById("front_page");
            $(front_page).empty();
            var next_page = document.getElementById("next_page");
            $(next_page).empty();
            var bookintro = document.getElementById("bookintro");
            $(bookintro).empty();
            var read_start = document.getElementById("start_read");
            $(read_start).remove();
            var coverimage = document.getElementById("coverimage");
            $(coverimage).empty();

//生成开始阅读按钮
            var start_read = document.createElement("a");
            var start_text = document.createTextNode("开始阅读");
            start_read.setAttribute("id","start_read");
            start_read.setAttribute("href","#coverimage");
            start_read.appendChild(start_text);
            var coverimage = document.getElementById("coverimage");
            insterAfter(start_read,coverimage);

            var get_readurl = this.getAttribute("href");
            get_article(get_readurl);
            //报存当前点击地址
            var save_url = document.createElement("a");
            save_url.setAttribute("id","save_url");
            save_url.setAttribute("href",get_readurl);
            var bookintro = document.getElementById("bookintro");
            $(save_url).appendTo(bookintro);
            return false;
            }
        }
//返回目录事件
    var back = document.getElementById("back");
    back.onclick = function() {
        window.location.reload();
        return false;
    }
//书目翻页事件
    var lastlist = document.getElementById("lastlist");
        lastlist.onclick = function() {

        }
    var nextlist = document.getElementById("nextlist");
        nextlist.onclick = function() {
        }
}

//后台获取书名内容与解析xml
function get_article(get_readurl) {
    var URL = "http://" +serverURL+ ":8080/GetDateWithServlet?getBookIntro="+get_readurl;
    xmlHttp.open("GET", URL, false);
    xmlHttp.onreadystatechange = article_update;
    xmlHttp.send(null);

}
function article_update() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var response =xmlHttp.responseText;
        var parse = new DOMParser();
        var xmldoc = parse.parseFromString(response,"text/xml");
        smart_read(xmldoc);
    }
}
//获取简介与封面
function smart_read(xmldoc) {
    var get_bookintro = xmldoc.getElementsByTagName("bookIntro");
    for (var i=0; i<get_bookintro.length; i++) {
//        if (get_bookintro.firstChild.nodeValue == null) continue;
        var intro = get_bookintro[i].firstChild.nodeValue;
        var p = document.createElement("p");
        p.setAttribute("class","bookintro");
        var intro_text = document.createTextNode(intro);
        p.appendChild(intro_text);
        var bookintro = document.getElementById("bookintro");
        bookintro.appendChild(intro_text);
    }
    var get_coverimage = xmldoc.getElementsByTagName("coverimage");
    for (var j=0; j<get_coverimage.length; j++) {
        var image = get_coverimage[j].firstChild.nodeValue;
        var coverimage = document.getElementById("coverimage");
        var picture = document.createElement("img");
        picture.setAttribute("src",image);
        coverimage.appendChild(picture);
    }
    //开始阅读
    var start_read = document.getElementById("start_read");
    start_read.onclick = function() {
        var save_url = document.getElementById("save_url");
        var get_url = save_url.getAttribute("href");

        var URL = "http://" +serverURL+ ":8080/GetDateWithServlet?getChapterList="+get_url;
        xmlHttp.open("GET", URL, false);
        xmlHttp.onreadystatechange = chapter_update;
        xmlHttp.send(null);

        //清空
        var bookintro = document.getElementById("bookintro");
        $(bookintro).empty();
        var coverimage = document.getElementById("coverimage");
        $(coverimage).empty();
        var read_start = document.getElementById("start_read");
        $(read_start).remove();
        return false;
    }
}
//点击开始阅读后解析xml
function chapter_update() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var response =xmlHttp.responseText;
        var parse = new DOMParser();
        var xmldoc = parse.parseFromString(response,"text/xml");
        chapterList(xmldoc);
    }
}
//获取章节内容与展示
function chapterList(xmldoc) {
    var chaperlist = xmldoc.getElementsByTagName("chapter");
    var chaper_ul = document.createElement("ul");
    chaper_ul.setAttribute("id","chaper_ul");
    for (var i=0; i<chaperlist.length; i++) {
        var chaper_name = chaperlist[i].firstChild.nodeValue;
        var chaper_url = chaperlist[i].getAttribute("href");
        var a = document.createElement("a");
        a.setAttribute("class","readbook");
        var text = document.createTextNode(chaper_name);
        a.appendChild(text);
        a.setAttribute("href",chaper_url);
        var li = document.createElement("li");
        li.appendChild(a);
        chaper_ul.appendChild(li);
        var chapter = document.getElementById("chapter");
        $(chaper_ul).appendTo(chapter)
    }
    //点击章节
    var read_book = document.getElementsByClassName("readbook");
    for (var j=0; j<read_book.length; j++) {
        read_book[j].onclick = function() {
            var get_bookurl = this.getAttribute("href");
            var URL = "http://" +serverURL+ ":8080/GetDateWithServlet?readBook="+get_bookurl;
            xmlHttp.open("GET", URL, false);
            xmlHttp.onreadystatechange = content_update;
            xmlHttp.send(null);
            //清空
            var bookintro = document.getElementById("bookintro");
            $(bookintro).empty();
            var coverimage = document.getElementById("coverimage");
            $(coverimage).empty();
            var read_start = document.getElementById("start_read");
            $(read_start).remove();
            var chaper_ul = document.getElementById("chaper_ul");
            $(chaper_ul).remove();
            //生成返回目录
            var backChapter = document.createElement("a");
            backChapter.setAttribute("id","backchapter");
            backChapter.setAttribute("href",get_bookurl);
            var backtext = document.createTextNode("返回目录");
            backChapter.appendChild(backtext);
            var back_chapter = document.getElementById("back_chapter");
            $(backChapter).appendTo(back_chapter);

            return false;
        }
    }
}
function content_update() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var response =xmlHttp.responseText;
        var parse = new DOMParser();
        var xmldoc = parse.parseFromString(response,"text/xml");
        readBook(xmldoc);
    }
}
//获取书籍内容与展示
function readBook(xmldoc) {
    //插入章节号
    var get_title = xmldoc.getElementsByTagName("h1");
    for (var j=0; j<get_title.length; j++) {
        var get_title_text = get_title[j].firstChild.nodeValue;
        var title = document.createElement("h1");
        title.setAttribute("class","title");
        var title_text = document.createTextNode(get_title_text);
        title.appendChild(title_text);
        var chapter = document.getElementById("chapter");
        chapter.appendChild(title);
    }
    //插入正文
    var result = xmldoc.getElementsByTagName("p");
    for (var i=0; i<result.length; i++) {
        var content = result[i].firstChild.nodeValue;
        var p = document.createElement("p");
        p.setAttribute("class","article");
        var text = document.createTextNode(content);
        p.appendChild(text);
        var article = document.getElementById("article");
        article.appendChild(p);
    }
    //下一页
    var nextpage = document.createElement("a");
    nextpage.setAttribute("id","next");
    nextpage.setAttribute("href","#chapter");
    var nextpage_text = document.createTextNode("下一页");
    nextpage.appendChild(nextpage_text);
    var next_page = document.getElementById("next_page");
    next_page.appendChild(nextpage);
    //上一页
    var frontpage = document.createElement("a");
    frontpage.setAttribute("id","front");
    frontpage.setAttribute("href","#chapter");
    var frontpage_text = document.createTextNode("上一页");
    frontpage.appendChild(frontpage_text);
    var front_page = document.getElementById("front_page");
    front_page.appendChild(frontpage);
    //返回章节
//下一页标签点击事件
    nextpage.onclick = function() {
        //清空
        var article = document.getElementById("article");
        $(article).empty();
        var chapter = document.getElementById("chapter");
        $(chapter).empty();
        var chaper_ul = document.getElementById("chaper_ul");
        $(chaper_ul).remove();
        var front_page = document.getElementById("front_page")
        $(front_page).empty();
        var next_page = document.getElementById("next_page")
        $(next_page).empty();

        page_Next();
    }
    frontpage.onclick = function() {
        //清空
        var article = document.getElementById("article");
        $(article).empty();
        var chapter = document.getElementById("chapter");
        $(chapter).empty();
        var chaper_ul = document.getElementById("chaper_ul");
        $(chaper_ul).remove();
        var front_page = document.getElementById("front_page")
        $(front_page).empty();
        var next_page = document.getElementById("next_page")
        $(next_page).empty();

        front_Page();
    }
}
function page_Next() {
    var URL = "http://" +serverURL+ ":8080/GetDateWithServlet?Next";
    xmlHttp.open("GET", URL, false);
    xmlHttp.onreadystatechange = next_Page;
    xmlHttp.send(null);
}
function next_Page() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var response =xmlHttp.responseText;
        var parse = new DOMParser();
        var xmldoc = parse.parseFromString(response,"text/xml");
        readBook(xmldoc);
    }
}

function front_Page() {
    var URL = "http://" +serverURL+ ":8080/GetDateWithServlet?Last";
    xmlHttp.open("GET", URL, false);
    xmlHttp.onreadystatechange = page_Front;
    xmlHttp.send(null);
}
function page_Front() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var response =xmlHttp.responseText;
        var parse = new DOMParser();
        var xmldoc = parse.parseFromString(response,"text/xml");
        readBook(xmldoc);
    }
}
//样式更改
function changStyle() {
    var change = document.getElementById("change");
    change.onclick = function() {
        var chapter = document.getElementById("chapter");
        chapter.style.backgroundColor = "#f868bb";
        var article = document.getElementById("article");
        article.style.backgroundColor = "#f868bb";

        return false;
    }
}
//DOM插入方法
function insterAfter(newElement, targetElement) {
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}

addLoadEvent(xmlHttpRequest);
addLoadEvent(updatePage);



