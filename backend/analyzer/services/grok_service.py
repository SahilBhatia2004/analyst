import os
import requests
from django.conf import settings


class GrokService:
    """Service to interact with Grok API for SQL generation"""
    
    def __init__(self):
        self.api_key = settings.GROK_API_KEY
        self.api_url = settings.GROK_API_URL
        self.model = settings.LLAMA_MODEL
    
    def generate_sql(self, natural_language_query, schema_info):
        """
        Convert natural language query to SQL using Grok API
        
        Args:
            natural_language_query: User's question in plain English
            schema_info: Information about the data structure (columns, types)
        
        Returns:
            Generated SQL query string
        """
        prompt = f"""You are an expert SQL analyst. Convert the following natural language query into a SQL query.

Database Schema:
{schema_info}

Natural Language Query:
{natural_language_query}

Instructions:
1. Generate a valid SQL query that answers the question
2. Use appropriate aggregations, filters, and grouping
3. Return ONLY the SQL query without any explanation
4. Use standard SQL syntax
5. Ensure the query is optimized and efficient

SQL Query:"""

        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'model': self.model,
            'messages': [
                {
                    'role': 'system',
                    'content': 'You are an expert SQL analyst. Generate only valid SQL queries without any explanation or markdown formatting.'
                },
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            'temperature': 0.2,
            'max_tokens': 500
        }
        
        try:
            response = requests.post(self.api_url, headers=headers, json=payload)
            response.raise_for_status()
            
            result = response.json()
            sql_query = result['choices'][0]['message']['content'].strip()
            
            # Clean up the SQL query (remove markdown code blocks if present)
            sql_query = sql_query.replace('```sql', '').replace('```', '').strip()
            
            return sql_query
        except Exception as e:
            raise Exception(f"Error generating SQL: {str(e)}")
    
    def generate_insights(self, query, results_summary):
        """
        Generate insights from query results using Grok API
        
        Args:
            query: The original natural language query
            results_summary: Summary of the query results
        
        Returns:
            Generated insights as a string
        """
        prompt = f"""You are a data analyst. Provide insights based on the following query and results.

Query: {query}

Results Summary:
{results_summary}

Provide 2-3 key insights in a concise, professional manner. Focus on:
1. Main findings
2. Notable patterns or trends
3. Actionable recommendations (if applicable)

Keep the response under 150 words."""

        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'model': self.model,
            'messages': [
                {
                    'role': 'system',
                    'content': 'You are a professional data analyst providing concise insights.'
                },
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            'temperature': 0.7,
            'max_tokens': 300
        }
        
        try:
            response = requests.post(self.api_url, headers=headers, json=payload)
            response.raise_for_status()
            
            result = response.json()
            insights = result['choices'][0]['message']['content'].strip()
            
            return insights
        except Exception as e:
            raise Exception(f"Error generating insights: {str(e)}")
