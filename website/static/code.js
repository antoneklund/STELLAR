
const state = {}


function selectTopic(topicId) {
    const topicState = state[topicId] ?? {};
    state[topicId] = topicState;
    set_active_topic_div(topicId);
    update_markers_when_target_topic(topicId);
    fetchArticlesJSON().then(articles_json => {
        var articles_json_list = []
        for (var i in articles_json) {
            articles_json_list.push(articles_json[i])
        }
        var articles_in_topic = articles_json_list.filter(a => a.label == topicId);

        articles_node = document.getElementById("articles_list")
        articles_node.innerHTML = ""
        for (const i in articles_in_topic) {
            const article = articles_in_topic[i];
            var strong = document.createElement('strong');
            var p1 = document.createElement('p1');
            var p2 = document.createElement('p2');
            var li = document.createElement('li');
            var cb = document.createElement('INPUT');
            cb.setAttribute("type", "checkbox");
            cb.checked = topicState[article.id] ?? false;
            cb.addEventListener("change", (event) => {
                const isChecked = event.currentTarget.checked;
                if (isChecked) {
                    topicState[article.id] = isChecked;
                }
                else {
                    delete topicState[article.id]
                }
            })
            li.className = "list-group-item py-0 my-0";
            li.id = parseInt(article.id);
            li.onclick = function () { selectArticle(this.id) };

            strong.appendChild(document.createTextNode("(" + article.id + ") " + article.title))
            p1.appendChild(strong)
            p2.appendChild(document.createTextNode(article.keywords))
            li.appendChild(cb)
            li.appendChild(p1)
            li.appendChild(p2)
            articles_node.appendChild(li)
        }
    });
}

function set_active_topic_div(topicId) {
    var topic_header = document.getElementById("topic_panel");
    var topic_divs = topic_header.getElementsByClassName("list-group-item");
    var active_div = topic_header.getElementsByClassName("active");

    console.log(active_div.length);
    if (active_div.length != 0) {
        active_div[0].className = active_div[0].className.replace(" active", "");
    }
    topic_divs[topicId].className += " active";
}

function set_active_article_div(articleId) {
    var articles_header = document.getElementById("articles_panel");
    var article_divs = articles_header.getElementsByClassName("list-group-item");
    var active_div = articles_header.getElementsByClassName("active");

    if (active_div.length != 0) {
        active_div[0].className = active_div[0].className.replace(" active", "");
    }
    var article = document.getElementById(parseInt(articleId));
    article.className += " active";
}

function selectArticle(articleId) {
    // console.info(parseInt(articleId))
    set_active_article_div(articleId);
    fetchArticlesJSON().then(articles_json => {
        article = articles_json[parseInt(articleId)]
        // console.log(article)

        article_node = document.getElementById("article_text");
        article_node.innerHTML = "";
        text_node = document.createTextNode(article.text);
        article_node.appendChild(text_node);
    });
}


async function fetchArticlesJSON() {
    const response = await fetch('/articles');
    const articles = await response.json();
    var articles_json = JSON.parse(articles);
    return articles_json;
}


function create_plot() {
    Plotly.d3.csv('static/articles_df.csv', function (err, rows) {

        var data = []
        var labels = []
        for (i in rows) {
            if (!labels.includes(rows[i].label)) {
                labels.push(rows[i].label)
            }
        }
        console.log(labels)
        for (l in labels) {
            let x = [];
            let y = [];
            let z = [];
            let titles = [];
            let keywords = [];
            let texts = [];

            for (i in rows) {
                if (rows[i].label == parseInt(l)) {
                    let x_value = +(rows[i].x);
                    x.push(x_value);
                    let y_value = +(rows[i].y);
                    y.push(y_value);
                    let z_value = +(rows[i].z);
                    z.push(z_value);
                    let title_value = rows[i].title;
                    titles.push(title_value);
                    let keywords_value = rows[i].keywords;
                    keywords.push(keywords_value);
                    let text_value = [rows[i].title, rows[i].keywords]
                    texts.push(text_value)
                };
            };

            var label_group = {
                type: 'scatter3d',
                x: x,
                y: y,
                z: z,
                label: l,
                text: texts,
                hovertemplate: "<b>Title: </b>%{text[0]}<br></br>" +
                    "<b>Keywords: </b>%{text[1]}",
                hoverlabel: "right",
                mode: 'markers',
                name: "Topic " + parseInt(l),
                marker: {
                    size: 5,
                    line: {
                        color: 'rgb(0, 0, 0)',
                        // opacity: 0.01,
                        width: 0.1
                    },
                    // opacity: 0.8
                },
            };
            data.push(label_group);
        };


        console.log(data);
        var graphDiv = document.getElementById('plotly_container');

        var layout = {
            width: 1000,
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 0
            }
        };
        Plotly.newPlot(graphDiv, data, layout);
    });
};


function update_markers_when_target_topic(topicId) {
    var graphDiv = document.getElementById('plotly_container');
    // Set style for all 
    var update = {
        marker: {
            size: 5,
            line: {
                color: 'rgb(0, 0, 0)',
                width: 0.1
            },
        }
    };
    Plotly.restyle(graphDiv, update);

    // Update specific trace
    var update = {
        marker: {
            size: 10,
            line: {
                color: 'rgb(91, 192, 222)',
                width: 2
            },
        }
    };
    Plotly.restyle(graphDiv, update, [topicId]);
}

function reset_view() {
    var graphDiv = document.getElementById('plotly_container');
    var update = {
        marker: {
            size: 5,
            line: {
                color: 'rgb(0, 0, 0)',
                width: 0.1
            },
        }
    };
    Plotly.restyle(graphDiv, update);
}


function saveState() {
    console.log(state)
    fetch("/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify(state)
    })
}


fetchArticlesJSON().then(articles => {
    // console.log(articles);
});

create_plot();
