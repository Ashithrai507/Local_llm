The porpuse of this project is to build a locally running LLM model. But unlike traditional way here we are using two computational devices.
1. **The Host**: Runs the LLM engine, loads the model into its VRAM/RAM, and exposes an API endpoint (usually HTTP).
2. **The Client**: Runs a user interface (UI) or a coding extension that connects to the host's IP address.

But here instead of using pre built tools like Ollama or LMstudio we are going build somthing from root using llama-cpp

But the first thing to do is build a NAS from scratch
I decided to build a complate NAS system that can 
- File Storage
- File Sharing
- Media Streaming
- LLM Hosting
- Website Hosting
- Docker Management