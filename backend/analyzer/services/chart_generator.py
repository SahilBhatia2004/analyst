import plotly.graph_objects as go
import plotly.express as px
import pandas as pd


class ChartGenerator:
    """Service to generate Plotly charts from data"""
    
    def generate_chart(self, df, chart_type, title=""):
        """
        Generate a Plotly chart based on data and chart type
        
        Args:
            df: pandas DataFrame with query results
            chart_type: Type of chart (bar, pie, line, table, etc.)
            title: Chart title
        
        Returns:
            Dictionary with chart data in Plotly format
        """
        chart_type = chart_type.lower().strip()
        
        if 'bar' in chart_type:
            return self._generate_bar_chart(df, title)
        elif 'pie' in chart_type:
            return self._generate_pie_chart(df, title)
        elif 'line' in chart_type:
            return self._generate_line_chart(df, title)
        elif 'scatter' in chart_type:
            return self._generate_scatter_chart(df, title)
        elif 'table' in chart_type:
            return self._generate_table(df)
        else:
            # Default to bar chart
            return self._generate_bar_chart(df, title)
    
    def _generate_bar_chart(self, df, title):
        """Generate a bar chart"""
        if len(df.columns) < 2:
            raise ValueError("Bar chart requires at least 2 columns")
        
        x_col = df.columns[0]
        y_col = df.columns[1]
        
        return {
            'type': 'bar',
            'data': {
                'x': df[x_col].tolist(),
                'y': df[y_col].tolist(),
                'marker': {
                    'color': '#22c55e',
                    'line': {'color': '#16a34a', 'width': 1}
                },
                'name': y_col
            },
            'layout': {
                'title': title,
                'xaxis': {'title': x_col},
                'yaxis': {'title': y_col}
            }
        }
    
    def _generate_pie_chart(self, df, title):
        """Generate a pie chart"""
        if len(df.columns) < 2:
            raise ValueError("Pie chart requires at least 2 columns")
        
        labels_col = df.columns[0]
        values_col = df.columns[1]
        
        return {
            'type': 'pie',
            'data': {
                'labels': df[labels_col].tolist(),
                'values': df[values_col].tolist(),
                'marker': {
                    'colors': px.colors.qualitative.Set3
                },
                'textinfo': 'label+percent',
                'hoverinfo': 'label+value+percent'
            },
            'layout': {
                'title': title
            }
        }
    
    def _generate_line_chart(self, df, title):
        """Generate a line chart"""
        if len(df.columns) < 2:
            raise ValueError("Line chart requires at least 2 columns")
        
        x_col = df.columns[0]
        y_col = df.columns[1]
        
        return {
            'type': 'line',
            'data': {
                'x': df[x_col].tolist(),
                'y': df[y_col].tolist(),
                'mode': 'lines+markers',
                'marker': {'color': '#22c55e', 'size': 8},
                'line': {'color': '#22c55e', 'width': 2},
                'name': y_col
            },
            'layout': {
                'title': title,
                'xaxis': {'title': x_col},
                'yaxis': {'title': y_col}
            }
        }
    
    def _generate_scatter_chart(self, df, title):
        """Generate a scatter chart"""
        if len(df.columns) < 2:
            raise ValueError("Scatter chart requires at least 2 columns")
        
        x_col = df.columns[0]
        y_col = df.columns[1]
        
        return {
            'type': 'scatter',
            'data': {
                'x': df[x_col].tolist(),
                'y': df[y_col].tolist(),
                'mode': 'markers',
                'marker': {
                    'color': '#22c55e',
                    'size': 10,
                    'line': {'color': '#16a34a', 'width': 1}
                },
                'name': y_col
            },
            'layout': {
                'title': title,
                'xaxis': {'title': x_col},
                'yaxis': {'title': y_col}
            }
        }
    
    def _generate_table(self, df):
        """Generate a table view"""
        return {
            'type': 'table',
            'data': {
                'columns': df.columns.tolist(),
                'rows': df.values.tolist()
            }
        }
