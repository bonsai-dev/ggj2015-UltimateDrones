from google.appengine.ext import ndb

import json
import webapp2

class Score(ndb.Model):
    name = ndb. StringProperty(indexed=False)
    score = ndb.IntegerProperty(indexed=True)
    date = ndb.DateTimeProperty(auto_now_add=True)
    country = ndb. StringProperty(indexed=False)

class MainPage(webapp2.RequestHandler):
    def get(self):
        self.response.headers.add_header("Access-Control-Allow-Origin", "*")
        name = self.request.get('name')
        score_query = Score.query(ancestor=ndb.Key('Score', 'scores')).order(-Score.score)
        scores = score_query.fetch(10)

        
        result = []
        for score in scores:
            result.append({
                'score':score.score,
                'name':score.name,
                'date':score.date.strftime('%c'),
                'country':score.country
            })
        self.response.write(json.dumps(result))
    def put(self):
        score = Score(parent=ndb.Key('Score', 'scores'))
        result = json.loads(self.request.body)
        score.score = result['score']
        score.name = result['name']
        score.country = self.request.headers.get("X-AppEngine-Country")
        score.put()
        self.response.headers.add_header("Access-Control-Allow-Origin", "*")
    def post(self):
        score = Score(parent=ndb.Key('Score', 'scores'))
        result = json.loads(self.request.body)
        score.score = result['score']
        score.name = result['name']
        score.country = self.request.headers.get("X-AppEngine-Country")
        score.put()
        self.response.headers.add_header("Access-Control-Allow-Origin", "*")

application = webapp2.WSGIApplication([
    ('/', MainPage),
], debug=True)