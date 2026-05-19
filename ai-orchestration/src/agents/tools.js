import axios from "axios";
import { tool } from "langchain/tools";
import * as z from "zod";

export const listFiles = tool(
  async ({}) => {
    console.log("================================");
    console.log("Using ListFiles Tool");
    console.log("================================");

    const response = await axios.get("http://sandbox-service-019e4007-3329-711a-8919-6eb5b5fe9a2a:3000/list-files")

    console.log("================================");
    console.log("Reponse from ListFiles Tool : ", response.data);
    console.log("================================");

    return JSON.stringify(response.data.files);
  },
  {
    name: "list_files",
    description:
      "List all the files in the project directory. This is useful to understand the context of the project and decide which files to modify.",
    schema: z.object({}),
  },
);

export const readFiles = tool(
  async ({ files }) => {

    console.log("===============================");
    console.log("Using ReadFiles Tool with files : ", files);
    console.log("===============================");
    
    const response = await axios.get("http://sandbox-service-019e4007-3329-711a-8919-6eb5b5fe9a2a:3000/read-files?files=" + files.join(","))
    
    console.log("===============================");
    console.log("Reponse from ReadFiles Tool : ", response.data);
    console.log("===============================");
    
    return JSON.stringify(response.data);
  },
  {
    name: "read_files",
    description:
      "Read the contents of specified files. This is useful for understanding the content of files that are relevant to the task at hand.",
    schema: z.object({
      files: z
        .array(z.string())
        .describe(
          "List of files absolute paths to read. These should be the files that were listed by list_files tool or created later.",
        ),
    }),
  },
);

export const updateFiles = tool(
  async ({ files }) => {

    console.log("==============================");
    console.log("Using UpdateFiles Tool with files : ", files);
    console.log("==============================");

    const response = await axios.patch("http://sandbox-service-019e4007-3329-711a-8919-6eb5b5fe9a2a:3000/update-files", { updates: files })
    
    console.log("==============================");
    console.log("Reponse from UpdateFiles Tool : ", response.data);
    console.log("==============================");

    return JSON.stringify(response.data.results);
  },
  {
    name: "update_files",
    description:
      "Update specified files with new content. This is useful for modifying existing files to add new features or fix bugs. This tool can also be used to create new files by providing the absolute path to the new file and the content to write to the file.",
    schema: z.object({
      files: z.array(
        z.object({
          file: z.string().describe("The absolute path of the file to update"),
          content: z
            .string()
            .describe(
              "The new content to write to the file. Use this to add new features or fix bugs.",
            ),
        }),
      ),
    }),
  },
);

export const deleteFiles = tool(
  async ({ files }) => {
    console.log("==============================");
    console.log("Using DeleteFiles Tool with files : ", files);
    console.log("==============================");

    const response = await axios.delete("http://sandbox-service-019e4007-3329-711a-8919-6eb5b5fe9a2a:3000/delete-files", { data: { files } })

    console.log("==============================");
    console.log("Reponse from DeleteFiles Tool : ", response.data);
    console.log("==============================");

    return JSON.stringify(response.data.results);
  },
  {
    name: "delete_files",
    description: "Delete specified files or folders from the project. This is useful for removing redundant or old files.",
    schema: z.object({
      files: z.array(z.string()).describe("List of relative file paths to delete recursively."),
    }),
  }
);