using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using GuideDogsPlatformWback.DTOs;
using TriangleFileStorage;
using FinalDbRepository;

namespace Prog3_WebApi_Javascript.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediaController : ControllerBase
    {
        private readonly FilesManage _filesManage;
        private readonly DbRepository _db;
        private readonly string audioFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "audio");
        private readonly string audioFileName = "story"; // Name of the audio file without extension

        public MediaController(FilesManage filesManage, DbRepository db)
        {
            _filesManage = filesManage;
            _db = db;
        }

        [HttpGet("GetMedia")]
        public async Task<IActionResult> GetMedia()
        {
            try
            {
                string query = "SELECT * FROM Media";
                var param = new { };

                var allMedia = await _db.GetRecordsAsync<MediaDTO>(query, param);

                if (allMedia == null)
                {
                    return NotFound("No media was found");
                }

                return Ok(allMedia);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex}");
                return StatusCode(500, "An error occurred while fetching the media.");
            }
        }

        [HttpGet("GetAudio")]
        public async Task<IActionResult> GetAudio()
        {
            try
            {
                string query = "SELECT * FROM Audio";
                var param = new { };

                var audios = await _db.GetRecordsAsync<AudioDto>(query, param);

                if (audios == null)
                {
                    return NotFound("No audio was found");
                }

                return Ok(audios);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex}");
                return StatusCode(500, "An error occurred while fetching the audio.");
            }
        }


        //[HttpPost("replaceimage/{id}")]
        //public async Task<IActionResult> ReplaceImage(int id, IFormFile imageFile)
        //{
        //    if (imageFile == null || imageFile.Length == 0)
        //    {
        //        return BadRequest("Image file is required.");
        //    }

        //    try
        //    {
        //        // Fetch the current image URL from the database
        //        string getCurrentUrlQuery = "SELECT ImageURL FROM Media WHERE Media_id = @Id";
        //        var currentUrlParam = new { Id = id };
        //        var currentImageUrlRecords = await _db.GetRecordsAsync<string>(getCurrentUrlQuery, currentUrlParam);
        //        string currentImageUrl = currentImageUrlRecords.FirstOrDefault();

        //        if (string.IsNullOrEmpty(currentImageUrl))
        //        {
        //            return NotFound($"No media found with ID {id}");
        //        }

        //        // Extract the file name from the URL
        //        string fileName = Path.GetFileName(currentImageUrl);

        //        // Construct the full path to the current image file
        //        string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
        //        string currentFilePath = Path.Combine(uploadsFolder, fileName);

        //        // Log the paths for debugging
        //        Console.WriteLine($"Current Image URL: {currentImageUrl}");
        //        Console.WriteLine($"File Path to Delete: {currentFilePath}");

        //        // Check if the current image file exists and delete it
        //        if (System.IO.File.Exists(currentFilePath))
        //        {
        //            System.IO.File.Delete(currentFilePath);
        //            Console.WriteLine($"Deleted old image: {currentFilePath}");
        //        }
        //        else
        //        {
        //            Console.WriteLine($"File not found: {currentFilePath}");
        //        }

        //        // Save the new image file with the same name
        //        using (var fileStream = new FileStream(currentFilePath, FileMode.Create))
        //        {
        //            await imageFile.CopyToAsync(fileStream);
        //            Console.WriteLine($"Saved new image: {currentFilePath}");
        //        }

        //        return Ok(new { message = "Image replaced successfully" });
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"Error: {ex.Message}");
        //        return StatusCode(500, $"Error replacing image: {ex.Message}");
        //    }
        //}







        [HttpPost("replaceimage/{id}")]
        public async Task<IActionResult> ReplaceImage(int id, IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
            {
                return BadRequest("Image file is required.");
            }

            try
            {
                // Fetch the current image URL and Unit_id from the database
                string getCurrentUrlQuery = "SELECT ImageURL, Unit_id FROM Media WHERE Media_id = @Id";
                var currentUrlParam = new { Id = id };
                var currentImageRecord = await _db.GetRecordsAsync<MediaDTO>(getCurrentUrlQuery, currentUrlParam);
                var currentImage = currentImageRecord.FirstOrDefault();

                if (currentImage == null)
                {
                    return NotFound($"No media found with ID {id}");
                }

                // Extract the Unit_id and file name from the URL
                string folderName = currentImage.Unit_id.ToString();
                string fileName = Path.GetFileName(currentImage.ImageURL);
                string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", folderName);

                // Ensure the directory exists
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Construct the full path to the current image file
                string currentFilePath = Path.Combine(uploadsFolder, fileName);

                // Check if the current image file exists and delete it
                if (System.IO.File.Exists(currentFilePath))
                {
                    System.IO.File.Delete(currentFilePath);
                }

                // Save the new image file with the same name
                using (var fileStream = new FileStream(currentFilePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(fileStream);
                }

                return Ok(new { message = "Image replaced successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error replacing image: {ex.Message}");
            }
        }




        [HttpPost("updateMediaDetails")]
        public async Task<IActionResult> UpdateMediaDetails(MediaDTO media)
        {
            if (media == null)
            {
                return BadRequest("Media data is required.");
            }

            try
            {
                string updateQuery = @"
        UPDATE Media 
        SET ImageTitle = @ImageTitle, ImageAlt = @ImageAlt, Class = @Class
        WHERE Media_id = @Media_id";

                var param = new
                {
                    media.ImageTitle,
                    media.ImageAlt,
                    media.Class, 
                    media.Media_id
                };

                var result = await _db.SaveDataAsync(updateQuery, param);

                if (result)
                {
                    return Ok(new { message = "Media details updated successfully" });
                }
                else
                {
                    return NotFound($"No media found with ID {media.Media_id}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, $"Error updating media details: {ex.Message}");
            }
        }




        [HttpPost("replaceaudio")]
        public async Task<IActionResult> ReplaceAudio(IFormFile audioFile)
        {
            if (audioFile == null || audioFile.Length == 0)
            {
                return BadRequest("Audio file is required.");
            }

            try
            {
                // Create the audio folder if it doesn't exist
                if (!Directory.Exists(audioFolder))
                {
                    Directory.CreateDirectory(audioFolder);
                }

                // Delete the existing audio files
                string[] supportedExtensions = new[] { ".ogg", ".mp3" };
                foreach (var ext in supportedExtensions)
                {
                    string currentFilePath = Path.Combine(audioFolder, $"{audioFileName}{ext}");
                    if (System.IO.File.Exists(currentFilePath))
                    {
                        System.IO.File.Delete(currentFilePath);
                        Console.WriteLine($"Deleted old audio: {currentFilePath}");
                    }
                }

                // Save the new audio file
                string newFileExtension = Path.GetExtension(audioFile.FileName);
                if (!supportedExtensions.Contains(newFileExtension))
                {
                    return BadRequest($"Unsupported audio format. Supported formats are: {string.Join(", ", supportedExtensions)}");
                }

                string newFilePath = Path.Combine(audioFolder, $"{audioFileName}{newFileExtension}");
                using (var fileStream = new FileStream(newFilePath, FileMode.Create))
                {
                    await audioFile.CopyToAsync(fileStream);
                    Console.WriteLine($"Saved new audio: {newFilePath}");
                }

                return Ok(new { message = "Audio replaced successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, $"Error replacing audio: {ex.Message}");
            }
        }


        [HttpPost("replaceImageInHtml/{mediaId}")]
        public async Task<IActionResult> ReplaceImageInHtml(int mediaId)
        {
            try
            {
                // Step 1: Fetch the media record from the Media table
                string mediaQuery = "SELECT Media_id, ImageURL, ImageAlt, Unit_id FROM Media WHERE Media_id = @MediaId";
                var mediaParam = new { MediaId = mediaId };
                var mediaRecord = await _db.GetRecordsAsync<MediaDTO>(mediaQuery, mediaParam);
                var media = mediaRecord.FirstOrDefault();

                if (media == null)
                {
                    return NotFound($"No media found with ID {mediaId}");
                }

                // Step 2: Get the corresponding page HTML content from the Pages table
                string pageQuery = "SELECT Page_id, Page_Content FROM Pages WHERE Unit_id = @UnitId";
                var pageParam = new { UnitId = media.Unit_id };
                var pageRecords = await _db.GetRecordsAsync<PageContentUpdateDto>(pageQuery, pageParam);
                var page = pageRecords.FirstOrDefault();

                if (page == null)
                {
                    return NotFound($"No page found for Unit ID {media.Unit_id}");
                }

                // Step 3: Use regex to locate and update the <img> tag with the matching mediaId
                string pageContent = page.Page_Content;

                // Use a regex to find the <img> tag with the `data-mediaid` attribute matching the mediaId
                string pattern = $@"<img[^>]+data-mediaid=['""]{mediaId}['""][^>]*>";
                var regex = new System.Text.RegularExpressions.Regex(pattern);

                // Find the <img> tag that matches the mediaId
                var match = regex.Match(pageContent);
                if (!match.Success)
                {
                    return NotFound($"No image found in the HTML with mediaId {mediaId}");
                }

                // Extract the full <img> tag
                string imgTag = match.Value;

                // Step 4: Replace the src and alt attributes in the <img> tag
                string updatedImgTag = imgTag;
                updatedImgTag = System.Text.RegularExpressions.Regex.Replace(updatedImgTag, @"src=['""][^'""]+['""]", $"src=\"{media.ImageURL}\"");
                updatedImgTag = System.Text.RegularExpressions.Regex.Replace(updatedImgTag, @"alt=['""][^'""]+['""]", $"alt=\"{media.ImageAlt}\"");

                // Step 5: Replace the old <img> tag with the updated one in the HTML content
                string updatedHtmlContent = pageContent.Replace(imgTag, updatedImgTag);

                // Step 6: Update the Pages table with the modified HTML content
                string updatePageQuery = @"
            UPDATE Pages 
            SET Page_Content = @PageContent, Update_Date = @UpdateDate 
            WHERE Page_id = @PageId";

                var updateParam = new
                {
                    PageContent = updatedHtmlContent,
                    UpdateDate = DateTime.Now,
                    PageId = page.Page_id
                };

                var updateResult = await _db.SaveDataAsync(updatePageQuery, updateParam);

                if (updateResult)
                {
                    return Ok(new { message = "Image updated successfully in HTML content" });
                }
                else
                {
                    return StatusCode(500, "Failed to update page content.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, $"Error occurred while replacing image: {ex.Message}");
            }

        }



        //[HttpGet("GetMediaByUnit/{unitId}")]
        //public async Task<IActionResult> GetMediaByUnit(int unitId)
        //{
        //    try
        //    {
        //        var query = "SELECT ImageURL, Class, ImageAlt, ImageTitle FROM Media WHERE Unit_id = @UnitId";
        //        var mediaRecords = await _db.GetRecordsAsync<MediaDTO>(query, new { UnitId = unitId });

        //        if (mediaRecords == null || !mediaRecords.Any())
        //        {
        //            return NotFound("No media records found.");
        //        }

        //        return Ok(mediaRecords);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Internal server error: {ex.Message}");
        //    }
        //}


        [HttpGet("GetMediaByUnit")]
        public async Task<IActionResult> GetMediaByUnit([FromQuery] int unitId)
        {
            try
            {
                // Define your SQL query to retrieve media items by Unit_id
                string query = "SELECT ImageURL, Class, ImageAlt, ImageTitle FROM Media WHERE Unit_id = @UnitId";
                var param = new { UnitId = unitId };

                // Fetch media records from the database
                var mediaRecords = await _db.GetRecordsAsync<MediaDTO>(query, param);

                if (mediaRecords == null || !mediaRecords.Any())
                {
                    return NotFound("No media records found.");
                }

                return Ok(mediaRecords);
            }
            catch (Exception ex)
            {
                // Log the exception and return a server error response
                Console.WriteLine($"An error occurred: {ex.Message}");
                return StatusCode(500, "An error occurred while fetching media records.");
            }
        }




        //[HttpGet("GetMediaByUnit/{unitId}")]
        //    public async Task<IActionResult> GetMediaByUnit(int unitId)
        //    {
        //        try
        //        {
        //            // Query to fetch media by Unit_id
        //            string query = "SELECT * FROM Media WHERE Unit_id = @UnitId ORDER BY Media_id";
        //            var param = new { UnitId = unitId };

        //            var mediaRecords = await _db.GetRecordsAsync<MediaDTO>(query, param);

        //            if (mediaRecords == null || !mediaRecords.Any())
        //            {
        //                return NotFound($"No media found for Unit ID {unitId}");
        //            }

        //            return Ok(mediaRecords);
        //        }
        //        catch (Exception ex)
        //        {
        //            Console.WriteLine($"An error occurred: {ex}");
        //            return StatusCode(500, "An error occurred while fetching the media.");
        //        }
        //    }
    }
}
