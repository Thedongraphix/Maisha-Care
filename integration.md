

# Maisha Care AI Engine Frontend Integration Guide

## Overview

This guide explains how to integrate your frontend application with the Maisha Care AI Engine backend. We'll focus on key integration points and workflows, with minimal code examples in TypeScript.

## User Flow

The consultation follows these stages:
1.  **Initial Chat** - Collect basic info
2.  **Medical History** - Document relevant background
3.  **Symptom Assessment** - Evaluate symptoms
4.  **Test Recommendation** - AI recommends tests
5.  **Awaiting Tests** - User uploads test results
6.  **Test Analysis** - System analyzes results
7.  **Diagnosis** - System generates diagnosis
8.  **Treatment Plan** - Treatment recommendations
9.  **Completed** - Consultation concludes

## Basic Chat Integration

### Step 1: Setup Consultation State Management

Manage the `consultationId` (e.g., in `localStorage`) and the `currentStage` of the consultation in your frontend's state.

```typescript
// Store consultation ID across page refreshes
const getConsultationId = (): string | null => {
  return localStorage.getItem('consultationId');
};

const setConsultationId = (id: string): void => {
  localStorage.setItem('consultationId', id);
};

// Track current stage in your component's state or a global store
// let currentStage: string | null = null; // Example
```

### Step 2: Implement Chat Message Sending

Create a function to send messages to the `/chat` endpoint.

```typescript
interface ChatResponse {
  consultation_id: string;
  message: string;
  stage: string;
  next_steps?: string;
}

async function sendMessage(messageText: string, fileToUpload?: File): Promise<ChatResponse> {
  try {
    // Show a loading/typing indicator in the UI
    // ui.showTypingIndicator();

    const consultationId = getConsultationId();

    // Prepare form data for potential file upload
    const formData = new FormData();
    formData.append('message', messageText);

    if (consultationId) {
      formData.append('consultation_id', consultationId);
    }

    // Add file if present (see File Upload section)
    if (fileToUpload) {
      formData.append('file', fileToUpload);
    }

    const response = await fetch('/chat', {
      method: 'POST',
      body: formData,
      // Note: Do not set Content-Type header manually when using FormData;
      // the browser will set it correctly with the boundary.
    });

    if (!response.ok) {
      // Handle non-OK responses (e.g., 404, 500)
      const errorData = await response.json().catch(() => ({ detail: `HTTP error: ${response.status}` }));
      throw new Error(errorData.detail || `Error: ${response.status}`);
    }

    const data: ChatResponse = await response.json();

    // Store the returned consultation ID
    if (data.consultation_id) {
      setConsultationId(data.consultation_id);
    }

    // Update currentStage in your application's state
    // setCurrentStage(data.stage); // Example

    // Add assistant's message to chat UI
    // ui.addMessageToChat('assistant', data.message);

    // Update UI based on new stage and next_steps
    // ui.updateStageDisplay(data.stage, data.next_steps);

    return data;
  } catch (error) {
    console.error('Message send error:', error);
    // Display error to the user
    // ui.showError((error as Error).message);
    throw error;
  } finally {
    // Hide loading/typing indicator
    // ui.hideTypingIndicator();
  }
}
```

## File Upload Implementation

File uploads (e.g., test results) are sent via the primary `/chat` endpoint.

### Step 1: Create File Upload Component

Your UI should have a component that allows users to:
1.  Select a file (e.g., using `<input type="file">`).
2.  Preview the selected file's name and type.
3.  Clear the selection.

This component should only be active/visible when the consultation is in the `awaiting_tests` stage.

### Step 2: Handle File Selection in State

Store the selected file in your component's state.

```typescript
// In your chat component's state
// const [selectedFile, setSelectedFile] = useState<File | null>(null);

const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    // setSelectedFile(files[0]);
    // Update UI to show selected file name/preview
  } else {
    // setSelectedFile(null);
    // Clear file preview in UI
  }
};

const clearSelectedFile = () => {
  // setSelectedFile(null);
  // Clear the file input element's value if necessary
  // document.getElementById('yourFileInputId').value = '';
  // Clear file preview in UI
};
```

### Step 3: Send File with Message

When the user submits the chat form (which might include a message and/or a file):
1.  Retrieve the message text from your input.
2.  Retrieve the `selectedFile` from your state.
3.  Call the `sendMessage` function, passing both the text and the file.
4.  After a successful send, clear the `selectedFile` state and the file input.

```typescript
const handleChatSubmit = async (/*...params...*/) => {
  // const messageText = /* Get message text from input */;
  // const fileToSubmit = selectedFile; // from state

  if (!messageText && !fileToSubmit) {
    // ui.showError("Please enter a message or select a file.");
    return;
  }

  try {
    // ui.addUserMessageToChat(messageText); // Optimistically add user message to UI
    const response = await sendMessage(messageText, fileToSubmit);

    if (fileToSubmit) {
      clearSelectedFile(); // Clear file selection after successful send
    }
    // Process 'response' (assistant's message, new stage, etc.)
  } catch (error) {
    // Handle error, possibly remove optimistic UI update or mark as failed
  }
};
```

### File Upload Notes:
*   The backend will process the file if `currentStage` is appropriate (e.g. `awaiting_tests`).
*   Implement client-side validation for file size (e.g., < 10MB) and type (JPG, PNG, PDF, DOC(X)).
*   Provide clear user feedback for upload progress and success/failure.

## Server-Sent Events (SSE) Implementation

SSE is used for real-time updates on background workflow progress (e.g., test analysis).

### Step 1: Establish SSE Connection

Connect to the `/consultation/{consultation_id}/events` endpoint.

```typescript
interface WorkflowEvent {
  consultation_id: string;
  event_type: 'WORKFLOW_START' | 'WORKFLOW_PROGRESS' | 'WORKFLOW_COMPLETE' | 'WORKFLOW_ERROR';
  workflow_name: string; // e.g., "test_recommendation", "test_analysis"
  message: string;       // User-friendly message for UI
  timestamp: string;     // ISO datetime string
}

let eventSource: EventSource | null = null;

function connectToEventStream(): void {
  const consultationId = getConsultationId();
  if (!consultationId) {
    console.warn('SSE: No consultation ID, cannot connect.');
    return;
  }

  if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
    console.warn('SSE: Connection already open or connecting.');
    return;
  }

  console.log(`SSE: Connecting to /consultation/${consultationId}/events`);
  eventSource = new EventSource(`/consultation/${consultationId}/events`);

  eventSource.onopen = () => {
    console.log('SSE: Connection established.');
    resetBackoff(); // Reset reconnection attempts on successful connection
  };

  eventSource.onmessage = (event) => {
    try {
      const eventData: WorkflowEvent = JSON.parse(event.data);
      // console.log('SSE: Received event:', eventData);
      handleWorkflowEvent(eventData);
    } catch (error) {
      console.error('SSE: Error parsing event data:', error);
    }
  };

  eventSource.onerror = (error) => {
    console.error('SSE: Connection error:', error);
    eventSource?.close(); // Close the errored source before retrying
    // Implement reconnection logic (see Step 2)
    const backoffTime = getBackoffTime();
    console.log(`SSE: Retrying connection in ${backoffTime / 1000}s...`);
    setTimeout(connectToEventStream, backoffTime);
  };
}

function disconnectEventStream(): void {
  if (eventSource) {
    console.log('SSE: Disconnecting...');
    eventSource.close();
    eventSource = null;
  }
}
```
**When to Connect/Disconnect:**
*   **Connect:** After the first successful `/chat` response that returns a `consultation_id` (i.e., when a consultation starts or is loaded).
*   **Disconnect:** When the user explicitly ends the consultation, navigates away from the chat page, or the consultation reaches a "completed" state where no further background tasks are expected.

### Step 2: Implement Reconnection Strategy (Exponential Backoff)

```typescript
let reconnectAttempt = 0;
const MAX_RECONNECT_ATTEMPTS = 5; // Optional: Limit retries

function getBackoffTime(): number {
  if (reconnectAttempt >= MAX_RECONNECT_ATTEMPTS) {
    console.error("SSE: Max reconnection attempts reached.");
    // Optionally, notify the user that real-time updates are unavailable
    return -1; // Indicate no more retries
  }
  const baseDelay = 1000; // 1 second
  const maxDelay = 30000; // 30 seconds
  const delay = Math.min(baseDelay * Math.pow(2, reconnectAttempt), maxDelay);
  reconnectAttempt++;
  return delay;
}

function resetBackoff(): void {
  reconnectAttempt = 0;
}
```
Modify `eventSource.onerror` to use `getBackoffTime`. If it returns -1, stop retrying.

### Step 3: Handle Workflow Events in UI

Update your UI based on received `WorkflowEvent` objects.

```typescript
function handleWorkflowEvent(event: WorkflowEvent): void {
  const { event_type, workflow_name, message } = event;

  // Example: Display messages in a dedicated status area or toast notifications
  switch (event_type) {
    case 'WORKFLOW_START':
      // ui.showWorkflowStatus(workflow_name, `Starting: ${message}`);
      // ui.disableChatInput(); // Optionally disable input during critical workflows
      break;
    case 'WORKFLOW_PROGRESS':
      // ui.updateWorkflowStatus(workflow_name, `In Progress: ${message}`);
      break;
    case 'WORKFLOW_COMPLETE':
      // ui.clearWorkflowStatus(workflow_name, `Completed: ${message}`);
      // ui.enableChatInput();
      // Potentially, the /chat endpoint might send a new message after a workflow completes
      // or you might need to send a "continue" message from the UI.
      // Check if the stage has changed and update UI accordingly.
      // refreshConsultationState(); // Function to fetch latest consultation state
      break;
    case 'WORKFLOW_ERROR':
      // ui.showWorkflowError(workflow_name, `Error: ${message}`);
      // ui.enableChatInput();
      break;
  }
}
```
You'll need UI components to display these workflow statuses (e.g., a small notification area).

## Test Requisition & PDF Generation

After the `test_recommendation` workflow completes, the system may generate `test_requisition_data`. Your frontend can use this to create a PDF.

### Step 1: Fetch Requisition Data

Call the `/consultation/{consultation_id}/requisition-data` endpoint.

```typescript
interface TestRequisitionData {
  patient_name: string;
  patient_age: number;
  patient_sex: string;
  requesting_physician: string;
  date_requested: string; // ISO datetime string
  tests_requested: string[];
  clinical_notes?: string;
  priority: 'Routine' | 'Urgent';
}

async function fetchRequisitionData(): Promise<TestRequisitionData | null> {
  const consultationId = getConsultationId();
  if (!consultationId) {
    // ui.showError('No active consultation to fetch requisition data.');
    return null;
  }

  // ui.showLoading('Fetching test requisition data...');
  try {
    const response = await fetch(`/consultation/${consultationId}/requisition-data`);
    if (!response.ok) {
      if (response.status === 404) {
        // ui.showInfo('Test requisition data is not yet available for this consultation.');
        return null;
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Requisition data fetch error:', error);
    // ui.showError((error as Error).message);
    return null;
  } finally {
    // ui.hideLoading();
  }
}
```

### Step 2: Generate PDF (Client-Side)

Use a library like `jsPDF` or `pdfmake` to generate the PDF from the fetched `TestRequisitionData`.

```typescript
// Example using jsPDF (ensure you have it installed)
// import { jsPDF } from 'jspdf';

async function generateRequisitionPDF(): Promise<void> {
  const requisitionData = await fetchRequisitionData();
  if (!requisitionData) {
    // ui.showInfo('Could not generate PDF: Requisition data unavailable.');
    return;
  }

  // ui.showLoading('Generating PDF...');
  try {
    // const pdf = new jsPDF();
    // pdf.text(`Test Requisition for ${requisitionData.patient_name}`, 10, 10);
    // pdf.text(`Age: ${requisitionData.patient_age}, Sex: ${requisitionData.patient_sex}`, 10, 20);
    // pdf.text('Tests Requested:', 10, 30);
    // requisitionData.tests_requested.forEach((test, index) => {
    //   pdf.text(`- ${test}`, 15, 40 + (index * 10));
    // });
    // ... add more details from requisitionData ...

    // const filename = `Test_Requisition_${requisitionData.patient_name.replace(/\s+/g, '_')}.pdf`;
    // pdf.save(filename);
    // ui.showSuccess(`PDF "${filename}" downloaded.`);
  } catch (error) {
    console.error('PDF generation error:', error);
    // ui.showError('Failed to generate PDF.');
  } finally {
    // ui.hideLoading();
  }
}
```
**Templating:** For a more professional look, consider using `html2canvas` to render an HTML template of the requisition form, then convert that canvas to an image in the PDF, or use `pdfmake`'s document definition structure.

### When to Offer PDF Generation:
*   After the `test_recommendation` workflow completes successfully (listen for the SSE event).
*   When `currentStage` is `awaiting_tests` (or subsequent stages if appropriate).
*   Provide a clear button or link in the UI, e.g., "Download Test Requisition PDF".

## Loading States & UI Feedback

Provide clear visual feedback to the user during API calls and background processes.

### Step 1: Implement Global/Component Loading States

Manage loading states (e.g., `isLoading`, `loadingMessage`) in your relevant components or a global store.

```typescript
// Example state in a component
// const [isLoading, setIsLoading] = useState(false);
// const [loadingMessage, setLoadingMessage] = useState('');

// function showLoading(message: string): void {
//   setLoadingMessage(message);
//   setIsLoading(true);
// }

// function hideLoading(): void {
//   setIsLoading(false);
//   setLoadingMessage('');
// }
```

### Step 2: Trigger Loading States

*   **Before API calls:** `showLoading('Sending message...')` or `showLoading('Fetching data...')`.
*   **On SSE `WORKFLOW_START`:** `showLoading(event.message)`.
*   **On API call completion/SSE `WORKFLOW_COMPLETE`/`WORKFLOW_ERROR`:** `hideLoading()`.

### Step 3: Stage-Specific UI Adjustments

*   **Disable chat input:** During critical workflows (e.g., `test_analysis`, `diagnosis`) where user input is not expected until the workflow completes. Re-enable it once the workflow finishes (via SSE `WORKFLOW_COMPLETE` or `WORKFLOW_ERROR`).
*   **Show relevant UI components:**
    *   File upload section: Only when `stage === 'awaiting_tests'`.
    *   "Download Requisition" button: Only when appropriate (see above).
*   **Display current stage name and guidance:** Update a dedicated area in your UI with `data.stage` and `data.next_steps` from `/chat` responses.

## Step-by-Step Integration Summary

1.  **Initial Setup:**
    *   State management for `consultationId`, `currentStage`, chat messages, and loading states.
    *   Basic UI layout for chat messages, input, and status display.
2.  **Chat Functionality:**
    *   Implement `sendMessage` to POST to `/chat`.
    *   Handle responses: update `consultationId`, `currentStage`, display assistant messages.
    *   If a new `consultationId` is received, initiate the SSE connection (`connectToEventStream`).
3.  **File Upload:**
    *   Add file input component, visible during `awaiting_tests` stage.
    *   Pass selected file to `sendMessage` function.
4.  **SSE Handling:**
    *   Implement `connectToEventStream` and `handleWorkflowEvent`.
    *   Update UI with workflow progress/status messages.
    *   Manage SSE connection lifecycle and reconnection.
5.  **Test Requisition:**
    *   Implement `fetchRequisitionData` and `generateRequisitionPDF`.
    *   Provide a UI trigger for PDF generation at appropriate times.
6.  **UI Feedback:**
    *   Implement clear loading indicators for API calls and SSE-indicated background tasks.
    *   Disable/enable UI elements based on `currentStage` and workflow activity.
    *   Display user-friendly error messages.
7.  **Consultation Lifecycle:**
    *   Handle starting new consultations (clear `consultationId`, reset state).
    *   Handle loading existing consultations (fetch history if needed, resume SSE).

## Common Error Handling Pointers

*   **Network Errors:** Catch errors in `fetch` calls.
*   **API Errors (Non-2xx HTTP Status):** Parse JSON error details from the response body if available (often in a `detail` field).
*   **SSE Errors:** Use `eventSource.onerror` for connection issues.
*   **File Errors:** Client-side validation (size, type) before upload; backend may also return errors.
*   **PDF Generation Errors:** Catch errors from your PDF library.

For all errors, display a clear, user-friendly message and log detailed error information for debugging.

This guide provides a structured approach to integrating your TypeScript frontend. Remember to adapt the UI interactions and state management to your specific framework (React, Angular, Vue, etc.). 