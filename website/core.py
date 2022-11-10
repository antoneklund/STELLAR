import pandas as pd
from markupsafe import Markup
import re


def load_main_df(path="website/static/articles_df.csv"):
    df = pd.read_csv(path, index_col=[0])
    return df


def load_topics_df(path="website/static/topics_df.csv"):
    df = pd.read_csv(path, index_col=[0])
    df = df.sort_values("topic_id")
    return df



def get_ids_titles_keywords(df):
    ids = df.index.to_list()
    titles = df["title"].to_list()
    keywords = df["keywords"].to_list()
    return ids, titles, keywords


def create_article_html_strings(ids, titles, all_keywords):
    html_strings = []
    for i, title in enumerate(titles):
        id = ids[i]
        keywords = all_keywords[i]
        html_string = create_article_html_string(id, title, keywords)
        html_strings.append(html_string)
    return html_strings


def create_article_html_string(id, title, keywords):
    html_string = '<li class=\'list-group-item\'>' \
                + '<p class=\'py-0 my-0\'>' \
                + '<strong>' \
                + '(' \
                + str(id) \
                + ') ' \
                + title \
                + '</strong>' \
                + '</p>' \
                + '<p class=\'py-0 my-0\'>' \
                + keywords \
                + '</p>' \
                + '</li>'
    return Markup(html_string)


def make_topics_df(df):
    topics_df = pd.DataFrame()
    topics_df["topic_id"] = df["label"].unique()
    topics_df["keywords"] = "[Hej]"
    for i, row in topics_df.iterrows():
        sample_row = select_articles_from_topic(df, row["topic_id"]).sample(1)
        keywords = sample_row["keywords"].to_string()
        keywords = re.sub("\d", "", keywords)
        topics_df["keywords"].iloc[i] = keywords
    topics_df = topics_df.sort_values("topic_id")
    return topics_df


def get_topic_ids_keywords(df):
    topic_ids = df["topic_id"].to_list()
    keywords = df["keywords"].to_list()
    return topic_ids, keywords


def create_topic_html_strings(ids, all_keywords):
    print(ids)
    html_strings = []
    for i, keywords in enumerate(all_keywords):
        id = ids[i]
        html_string = create_topic_html_string(id, keywords)
        html_strings.append(html_string)
    return html_strings


def create_topic_html_string(id, keywords):
    html_string = '<li class=\'list-group-item py-0 my-0\' id=\"' + str(id) + '\" onclick=\"selectTopic(' + str(id) + ')\">' \
                + '<strong>' \
                + 'Topic ' \
                + str(id) \
                + '</strong>' \
                + ': ' \
                + keywords \
                + '</li>'
    return Markup(html_string)


def select_articles_from_topic(df, topic_nr):
    return df[df["label"] == topic_nr]


def select_topic_articles_from_article_id(df, article_id):
    topic_nr = df["label"].iloc[article_id]
    return select_articles_from_topic(df, topic_nr)


def convert_articles_df_to_json(articles_df):
    articles_df["id"] = articles_df.index.to_list()
    articles_df = articles_df[["id", "title", "text", "keywords", "label"]]
    articles_json = articles_df.to_json(orient="index")
    return articles_json