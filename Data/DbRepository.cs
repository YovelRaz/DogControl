﻿using System;
using System.Data;
using Dapper;
using Microsoft.Data.Sqlite;

namespace FinalDbRepository
{
    public class DbRepository
    {
        //private IDbConnection _dbConnection;

        //public DbRepository(string connectionString)
        //{
        //    _dbConnection = new SqliteConnection(connectionString);
        //}

        private IDbConnection _dbConnection;

        public DbRepository(IConfiguration config)
        {
            _dbConnection = new SqliteConnection(config.GetConnectionString("DefaultConnection"));
        }
        //public string GetContent()
        //{
        //    // Open the database connection
        //    OpenConnection();

        //    try
        //    {
        //        // Execute the query to fetch content from the database
        //        string sql = "SELECT Page_Content FROM Pages"; 
        //        string content = _dbConnection.QueryFirstOrDefault<string>(sql);

        //        // Return the retrieved content
        //        return content;
        //    }
        //    catch (Exception ex)
        //    {
        //        // Handle any exceptions here
        //        Console.WriteLine("Error fetching content from the database: " + ex.Message);
        //        return null;
        //    }
        //    finally
        //    {
        //        // Make sure to close the database connection
        //        _dbConnection.Close();
        //    }
        //}

        

        public void OpenConnection()
        {
            //if there is no connection to the DB
            if (_dbConnection.State != ConnectionState.Open)
            {
                //Create new connection to the db
                _dbConnection.Open();
            }
        }

        public void CloseConnection()
        {
            _dbConnection.Close();
        }

        //parameters = query parameters
        public async Task<IEnumerable<T>> GetRecordsAsync<T>(string query, object parameters)
        {
            try
            {
                OpenConnection();

                //Query - Method from dapper
                //Query<RETURN_TYPE>();
                IEnumerable<T> records = await _dbConnection.QueryAsync<T>(query, parameters, commandType: CommandType.Text);

                CloseConnection();
                return records;
            }
            catch (Exception ex)
            {
                CloseConnection();
                throw;
            }
        }

        public async Task<bool> SaveDataAsync(string query, object parameters)
        {
            try
            {
                OpenConnection();

                //Return the amount of saved records 
                int records = await _dbConnection.ExecuteAsync(query, parameters, commandType: CommandType.Text);

                CloseConnection();

                //if one records or more updated - return true. else return false
                return records > 0;
            }
            catch (Exception ex)
            {
                CloseConnection();
                throw;
            }
        }

        public async Task<int> InsertReturnId(string query, object parameters)
        {
            try
            {
                OpenConnection();
                int results = await _dbConnection.ExecuteAsync(sql: query, param: parameters, commandType: CommandType.Text);

                if (results > 0)
                {
                    int Id = _dbConnection.Query<int>("SELECT last_insert_rowid()").FirstOrDefault();
                    CloseConnection();
                    return Id;
                }
                CloseConnection();
                return 0;
            }
            catch (System.Exception)
            {
                CloseConnection();
                throw;
            }
        }


    }
}

