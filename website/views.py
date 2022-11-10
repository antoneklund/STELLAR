from flask import Blueprint, render_template, request, flash, jsonify
import json
import pandas as pd
from website.core import *

views = Blueprint('views', __name__)

articles_df = load_main_df("website/static/data/articles_df.csv")
topics_df = load_topics_df("website/static/data/topics_df.csv")


@views.route('/', methods=['GET', 'POST'])
def home():
    ids, titles, keywords = get_ids_titles_keywords(articles_df)
    article_htmls = create_article_html_strings(ids, titles, keywords)
    ids, keywords = get_topic_ids_keywords(topics_df)
    topic_htmls = create_topic_html_strings(ids, keywords)
    return render_template("home.html", article_htmls=article_htmls, topic_htmls=topic_htmls)


@views.route("/articles", methods=["GET"])
def get_articles():
    articles_json = convert_articles_df_to_json(articles_df)
    return jsonify(articles_json)

@views.route("/save", methods=["POST"])
def save_state():
    print(request.json)
    with open("json_data.json", "w") as f:
        json.dump(request.json, f)
        
    return ""
