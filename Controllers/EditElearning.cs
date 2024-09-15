using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Nodes;
using Microsoft.Data.Sqlite;
using FinalDbRepository;
using GuideDogsPlatformWback.DTOs;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Xml;
using System;
using System.Reflection.Metadata;
using System.Runtime.InteropServices;
using Dapper;

namespace GuideDogsPlatformWback.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EditElearning : ControllerBase
    {
        private readonly DbRepository _db;

        public EditElearning(DbRepository db)
        {
            _db = db;
        }


        
        [HttpGet("PageInfo")]
        public async Task<IActionResult> GetPageInfo(int pageId)
        {
            string query = "SELECT Page_Code, Page_Content FROM Pages WHERE Page_id = @pageId";
            var param = new { pageId };

            var pageRecords = await _db.GetRecordsAsync<PageContentUpdateDto>(query, param);

            if (pageRecords != null && pageRecords.Any())
            {
                var pageInfoList = pageRecords.Select(pageRecord => new
                {
                    PageId = pageId,
                    PageCode = pageRecord.Page_Code,
                    PageContent = pageRecord.Page_Content
                }).ToList();

                return Ok(pageInfoList);
            }
            else
            {
                return NotFound();
            }
        }






        [HttpPost("UpdatePage")]
        public async Task<IActionResult> UpdateThePage(PageUpdateRequestDto data)
        {
            try
            {
                // Prepare anonymous object with properties matching the database columns
                var newData = new
                {
                    Page_id = data.Page_id,
                    Page_Content = data.Page_Content,
                    Update_Date = DateTime.Now,
                };

                // Log the data being sent to the server
                Console.WriteLine("Data sent to server:");
                Console.WriteLine($"Page Content: {newData.Page_Content}");
                Console.WriteLine($"Update Date: {newData.Update_Date}");

                // SQL query with parameters
                string updateQuery = "UPDATE Pages SET Page_Content = @Page_Content, Update_Date = @Update_Date WHERE Page_id = @Page_id";
                bool isUpdate = await _db.SaveDataAsync(updateQuery, newData); // Check if the update was successful

                if (isUpdate)
                {
                    string pageQuery = "SELECT Page_id,Page_Content,Update_Date FROM Pages WHERE Page_id = @Page_id";
                    var PagesRecords = await _db.GetRecordsAsync<PageContentUpdateDto>(pageQuery, newData);
                    PageContentUpdateDto updatedPage = PagesRecords.FirstOrDefault();

                    // Return the updatedPage object directly
                    return Ok(updatedPage);
                }
                else
                {
                    return BadRequest("Update Failed");
                }

            }
            catch (Exception ex)
            {
                // Log the exception for debugging purposes
                Console.WriteLine($"An error occurred: {ex}");

                // Return an appropriate error response
                return StatusCode(500, "An error occurred while updating the page.");
            }
        }






        //[HttpPost("duplicateUnit")]
        //public async Task<IActionResult> DuplicateUnit()
        //{
        //    try
        //    {
        //        // Step 1: Get the details of the unit to duplicate
        //        var unitToDuplicateQuery = "SELECT Unit_id, Unit_name, Category_name, Unit_Description, Unit_UpdateDate FROM Units WHERE Unit_id = @UnitId";
        //        var param = new { UnitId = 1 };  // Unit ID to duplicate (always 1)
        //        var unitToDuplicateRecords = await _db.GetRecordsAsync<UnitDTO>(unitToDuplicateQuery, param);

        //        if (unitToDuplicateRecords == null || !unitToDuplicateRecords.Any())
        //        {
        //            return BadRequest("Unit with Unit_id = 1 not found");
        //        }

        //        // Step 2: Create a new unit with the same Unit_name
        //        var unitToDuplicate = unitToDuplicateRecords.First();
        //        var insertUnitQuery = "INSERT INTO Units (Unit_name, Unit_UpdateDate) VALUES (@Unit_name, @Unit_UpdateDate)";
        //        int newUnitId = await _db.InsertReturnId(insertUnitQuery, new
        //        {
        //            Unit_name = unitToDuplicate.Unit_name,
        //            Unit_UpdateDate = DateTime.Now // Set current date for Unit_UpdateDate
        //        });

        //        if (newUnitId == 0) // Check if the new unit ID is valid
        //        {
        //            return StatusCode(500, "Failed to create a new unit.");
        //        }

        //        // Step 3: Duplicate pages associated with the original unit
        //        var originalPagesQuery = "SELECT * FROM Pages WHERE Unit_id = @OriginalUnitId";
        //        var originalPages = await _db.GetRecordsAsync<PageContentUpdateDto>(originalPagesQuery, new { OriginalUnitId = 1 });

        //        foreach (var originalPage in originalPages)
        //        {
        //            string insertPageQuery = @"
        //    INSERT INTO Pages (Page_Title, Page_Code, Update_Date, Page_Content, Unit_id, HtmlName)
        //    VALUES (@Page_Title, @Page_Code, datetime('now'), @Page_Content, @NewUnitId, @HtmlName)";

        //            var insertPageParams = new
        //            {
        //                Page_Title = originalPage.Page_Title,
        //                Page_Code = originalPage.Page_Code,
        //                Page_Content = originalPage.Page_Content,
        //                NewUnitId = newUnitId, // Use the new Unit ID
        //                HtmlName = originalPage.HtmlName
        //            };

        //            await _db.SaveDataAsync(insertPageQuery, insertPageParams);
        //        }

        //        // Step 4: Duplicate images and update Media records
        //        var originalImageDirectory = Path.Combine("wwwroot", "images", "1"); // Original Unit ID is always 1
        //        var newImageDirectory = Path.Combine("wwwroot", "images", newUnitId.ToString()); // Use the new Unit ID

        //        if (Directory.Exists(originalImageDirectory))
        //        {
        //            if (!Directory.Exists(newImageDirectory))
        //            {
        //                Directory.CreateDirectory(newImageDirectory);
        //            }

        //            var imageFiles = Directory.GetFiles(originalImageDirectory);
        //            // Fetch all media records at once
        //            var originalMediaRecords = await _db.GetRecordsAsync<MediaDTO>("SELECT ImageAlt, ImageTitle, ImageURL FROM Media WHERE Unit_id = @OriginalUnitId", new { OriginalUnitId = 1 });

        //            foreach (var file in imageFiles)
        //            {
        //                var fileName = Path.GetFileName(file);
        //                var newImagePath = Path.Combine(newImageDirectory, fileName);

        //                // Check if the file already exists
        //                if (!System.IO.File.Exists(newImagePath))
        //                {
        //                    System.IO.File.Copy(file, newImagePath, overwrite: true);
        //                }

        //                var originalMedia = originalMediaRecords.FirstOrDefault(m => m.ImageURL.EndsWith(fileName));

        //                // Ensure ImageAlt and ImageTitle are not null
        //                if (originalMedia == null)
        //                {
        //                    // Log or handle missing media record
        //                    Console.WriteLine($"No media record found for image: {fileName}");
        //                    continue;
        //                }

        //                // Update or insert the media record for the new unit
        //                string insertMediaQuery = @"
        //        INSERT INTO Media (Page_id, ImageURL, ImageAlt, ImageTitle, Unit_id)
        //        VALUES (@Page_id, @ImageURL, @ImageAlt, @ImageTitle, @Unit_id)";

        //                var insertMediaParams = new
        //                {
        //                    Page_id = originalPages.FirstOrDefault()?.Page_id, // Associate with the first page
        //                    ImageURL = Path.Combine("images", newUnitId.ToString(), fileName), // New image URL
        //                    ImageAlt = originalMedia.ImageAlt,
        //                    ImageTitle = originalMedia.ImageTitle,
        //                    Unit_id = newUnitId // Set the Unit_id to the newly created unit
        //                };

        //                await _db.SaveDataAsync(insertMediaQuery, insertMediaParams);
        //            }
        //        }

        //        return Ok(new { unitId = newUnitId, message = "Unit, pages, and images duplicated successfully." });
        //    }
        //    catch (Exception ex)
        //    {
        //        // Log the exception (implement logging as needed)
        //        return StatusCode(500, $"Internal server error: {ex.Message}");
        //    }
        //}








        // 13/9
        [HttpPost("duplicateUnit")]
        public async Task<IActionResult> DuplicateUnit()
        {
            try
            {
                // Step 1: Get the details of the unit to duplicate
                var unitToDuplicateQuery = "SELECT Unit_id, Unit_name, Category_name, Unit_Description, Unit_UpdateDate FROM Units WHERE Unit_id = @UnitId";
                var param = new { UnitId = 1 };  // Unit ID to duplicate (always 1)
                var unitToDuplicateRecords = await _db.GetRecordsAsync<UnitDTO>(unitToDuplicateQuery, param);

                if (unitToDuplicateRecords == null || !unitToDuplicateRecords.Any())
                {
                    return BadRequest("Unit with Unit_id = 1 not found");
                }

                // Step 2: Create a new unit with the same Unit_name
                var unitToDuplicate = unitToDuplicateRecords.First();
                var insertUnitQuery = "INSERT INTO Units (Unit_name, Unit_UpdateDate) VALUES (@Unit_name, @Unit_UpdateDate)";
                int newUnitId = await _db.InsertReturnId(insertUnitQuery, new
                {
                    Unit_name = unitToDuplicate.Unit_name,
                    Unit_UpdateDate = DateTime.Now // Set current date for Unit_UpdateDate
                });

                if (newUnitId == 0) // Check if the new unit ID is valid
                {
                    return StatusCode(500, "Failed to create a new unit.");
                }

                // Step 3: Duplicate pages associated with the original unit
                var originalPagesQuery = "SELECT * FROM Pages WHERE Unit_id = @OriginalUnitId";
                var originalPages = await _db.GetRecordsAsync<PageContentUpdateDto>(originalPagesQuery, new { OriginalUnitId = 1 });

                foreach (var originalPage in originalPages)
                {
                    string insertPageQuery = @"
            INSERT INTO Pages (Page_Title, Page_Code, Update_Date, Page_Content, Unit_id, HtmlName)
            VALUES (@Page_Title, @Page_Code, datetime('now'), @Page_Content, @NewUnitId, @HtmlName)";

                    var insertPageParams = new
                    {
                        Page_Title = originalPage.Page_Title,
                        Page_Code = originalPage.Page_Code,
                        Page_Content = originalPage.Page_Content,
                        NewUnitId = newUnitId, // Use the new Unit ID
                        HtmlName = originalPage.HtmlName
                    };

                    await _db.SaveDataAsync(insertPageQuery, insertPageParams);
                }

                // Step 4: Duplicate images and update Media records
                var originalImageDirectory = Path.Combine("wwwroot", "images", "1"); // Original Unit ID is always 1
                var newImageDirectory = Path.Combine("wwwroot", "images", newUnitId.ToString()); // Use the new Unit ID

                if (Directory.Exists(originalImageDirectory))
                {
                    if (!Directory.Exists(newImageDirectory))
                    {
                        Directory.CreateDirectory(newImageDirectory);
                    }

                    var imageFiles = Directory.GetFiles(originalImageDirectory);
                    // Fetch all media records at once
                    var originalMediaRecords = await _db.GetRecordsAsync<MediaDTO>("SELECT ImageAlt, ImageTitle, ImageURL, Class FROM Media WHERE Unit_id = @OriginalUnitId", new { OriginalUnitId = 1 });

                    foreach (var file in imageFiles)
                    {
                        var fileName = Path.GetFileName(file);
                        var newImagePath = Path.Combine(newImageDirectory, fileName);

                        // Check if the file already exists
                        if (!System.IO.File.Exists(newImagePath))
                        {
                            System.IO.File.Copy(file, newImagePath, overwrite: true);
                        }

                        var originalMedia = originalMediaRecords.FirstOrDefault(m => m.ImageURL.EndsWith(fileName));

                        // Ensure ImageAlt, ImageTitle, and Class are not null
                        if (originalMedia == null)
                        {
                            // Log or handle missing media record
                            Console.WriteLine($"No media record found for image: {fileName}");
                            continue;
                        }

                        // Update or insert the media record for the new unit
                        string insertMediaQuery = @"
                INSERT INTO Media (Page_id, ImageURL, ImageAlt, ImageTitle, Unit_id, Class)
                VALUES (@Page_id, @ImageURL, @ImageAlt, @ImageTitle, @Unit_id, @Class)";

                        var insertMediaParams = new
                        {
                            Page_id = originalPages.FirstOrDefault()?.Page_id, // Associate with the first page
                            ImageURL = Path.Combine("images", newUnitId.ToString(), fileName), // New image URL
                            ImageAlt = originalMedia.ImageAlt,
                            ImageTitle = originalMedia.ImageTitle,
                            Unit_id = newUnitId, // Set the Unit_id to the newly created unit
                            Class = originalMedia.Class // Use the Class from the original media record
                        };

                        await _db.SaveDataAsync(insertMediaQuery, insertMediaParams);
                    }
                }

                return Ok(new { unitId = newUnitId, message = "Unit, pages, and images duplicated successfully." });
            }
            catch (Exception ex)
            {
                // Log the exception (implement logging as needed)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }










        [HttpGet("UnitID")]
        public async Task<IActionResult> getAllUnitPage(int myUnit)
        {
            string GetUnitPages = "SELECT * FROM Pages WHERE Unit_id = @myUnit";
            var paramUnit = new
            {
                myUnit = myUnit
            };
            var records = await _db.GetRecordsAsync<PageContentUpdateDto>(GetUnitPages, paramUnit);

            if (records.Any())
            {
                return Ok(records); // Return the list of PageContentUpdateDto objects
            }
            else
            {
                return NotFound();
            }
        }



        [HttpGet("GetNextPageId")]
        public async Task<IActionResult> GetNextPageId(int currentUnitId, int currentPageId)
        {
            string query = @"
        SELECT Page_id FROM Pages
        WHERE Unit_id = @currentUnitId AND Page_id > @currentPageId
        ORDER BY Page_id ASC";
            var nextPage = await _db.GetRecordsAsync<int>(query, new { currentUnitId, currentPageId });

            return nextPage.Any() ? Ok(nextPage.First()) : NotFound("No next page available.");
        }

        [HttpGet("GetPreviousPageId")]
        public async Task<IActionResult> GetPreviousPageId(int currentUnitId, int currentPageId)
        {
            string query = @"
        SELECT Page_id FROM Pages
        WHERE Unit_id = @currentUnitId AND Page_id < @currentPageId
        ORDER BY Page_id DESC";
            var previousPage = await _db.GetRecordsAsync<int>(query, new { currentUnitId, currentPageId });

            return previousPage.Any() ? Ok(previousPage.First()) : NotFound("No previous page available.");
        }



        [HttpGet("GetPageIdByHtmlName")]
        public async Task<IActionResult> GetPageIdByHtmlName(int unitId, string htmlName)
        {
            string query = @"
        SELECT Page_id FROM Pages
        WHERE Unit_id = @unitId AND HtmlName = @htmlName";
            var pageId = await _db.GetRecordsAsync<int>(query, new { unitId, htmlName });

            return pageId.Any() ? Ok(pageId.First()) : NotFound("Page not found.");
        }


    }
}

