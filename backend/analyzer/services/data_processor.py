import pandas as pd
import io
from supabase import create_client
from django.conf import settings


class DataProcessor:
    """Service to process data files and execute SQL queries"""
    
    def __init__(self):
        self.supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    
    def load_file_from_supabase(self, file_path):
        """
        Load a file from Supabase storage
        
        Args:
            file_path: Path to the file in Supabase storage
        
        Returns:
            pandas DataFrame
        """
        try:
            # Download file from Supabase
            response = self.supabase.storage.from_('files').download(file_path)
            
            # Determine file type and load accordingly
            if file_path.endswith('.csv'):
                df = pd.read_csv(io.BytesIO(response))
            elif file_path.endswith(('.xlsx', '.xls')):
                df = pd.read_excel(io.BytesIO(response))
            else:
                raise ValueError(f"Unsupported file type: {file_path}")
            
            return df
        except Exception as e:
            raise Exception(f"Error loading file {file_path}: {str(e)}")
    
    def get_schema_info(self, df):
        """
        Extract schema information from DataFrame
        
        Args:
            df: pandas DataFrame
        
        Returns:
            Schema information as a string
        """
        schema_lines = ["Table: data"]
        schema_lines.append("Columns:")
        
        for col in df.columns:
            dtype = str(df[col].dtype)
            sample_values = df[col].dropna().head(3).tolist()
            schema_lines.append(f"  - {col} ({dtype}) - Sample: {sample_values}")
        
        return "\n".join(schema_lines)
    
    def execute_sql_on_dataframe(self, df, sql_query):
        """
        Execute SQL query on pandas DataFrame using pandasql
        
        Args:
            df: pandas DataFrame
            sql_query: SQL query string
        
        Returns:
            Query results as pandas DataFrame
        """
        try:
            # Use pandas operations to simulate SQL
            # This is a simplified version - for production, consider using duckdb or pandasql
            
            # For now, we'll use a simple approach with pandas
            # Replace 'data' table name with actual dataframe
            import sqlite3
            
            # Create in-memory SQLite database
            conn = sqlite3.connect(':memory:')
            
            # Write DataFrame to SQL
            df.to_sql('data', conn, index=False, if_exists='replace')
            
            # Execute query
            result_df = pd.read_sql_query(sql_query, conn)
            
            conn.close()
            
            return result_df
        except Exception as e:
            raise Exception(f"Error executing SQL query: {str(e)}")
    
    def get_results_summary(self, df):
        """
        Generate a summary of query results
        
        Args:
            df: pandas DataFrame with query results
        
        Returns:
            Summary string
        """
        summary_lines = []
        summary_lines.append(f"Total rows: {len(df)}")
        summary_lines.append(f"Columns: {', '.join(df.columns.tolist())}")
        
        # Add sample data
        if len(df) > 0:
            summary_lines.append("\nSample data:")
            summary_lines.append(df.head(5).to_string())
        
        # Add basic statistics for numeric columns
        numeric_cols = df.select_dtypes(include=['number']).columns
        if len(numeric_cols) > 0:
            summary_lines.append("\nNumeric summary:")
            summary_lines.append(df[numeric_cols].describe().to_string())
        
        return "\n".join(summary_lines)
