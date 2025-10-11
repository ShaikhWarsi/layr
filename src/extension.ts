import * as vscode from 'vscode';
import { planner } from './planner';

/**
 * This method is called when the extension is activated
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Layr extension is now active! 🚀');

  // Register the "Create Plan" command
  const createPlanCommand = vscode.commands.registerCommand('layr.createPlan', async () => {
    try {
      // Show input box to get user's prompt
      const prompt = await vscode.window.showInputBox({
        prompt: 'What do you want to build?',
        placeHolder: 'e.g., A React todo app with authentication and database',
        ignoreFocusOut: true,
        validateInput: (value: string) => {
          if (!value || value.trim().length === 0) {
            return 'Please enter a description of what you want to build';
          }
          if (value.trim().length < 10) {
            return 'Please provide a more detailed description (at least 10 characters)';
          }
          return null;
        }
      });

      if (!prompt) {
        return; // User cancelled
      }

      // Show progress indicator
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Generating project plan...',
        cancellable: false
      }, async (progress) => {
        progress.report({ increment: 0, message: 'Analyzing your request...' });
        
        try {
          // Generate the plan
          const plan = await planner.generatePlan(prompt.trim());
          
          progress.report({ increment: 50, message: 'Converting to Markdown...' });
          
          // Convert plan to Markdown
          const markdown = planner.planToMarkdown(plan);
          
          progress.report({ increment: 80, message: 'Opening plan in editor...' });
          
          // Create a new document with the plan
          const doc = await vscode.workspace.openTextDocument({
            content: markdown,
            language: 'markdown'
          });
          
          // Show the document in a new editor
          await vscode.window.showTextDocument(doc, {
            preview: false,
            viewColumn: vscode.ViewColumn.One
          });
          
          progress.report({ increment: 100, message: 'Plan generated successfully!' });
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          vscode.window.showErrorMessage(`Failed to generate plan: ${errorMessage}`);
          console.error('Plan generation error:', error);
        }
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      vscode.window.showErrorMessage(`Error: ${errorMessage}`);
      console.error('Create plan command error:', error);
    }
  });

  // Register the "Execute Plan" command
  const executePlanCommand = vscode.commands.registerCommand('layr.executePlan', async () => {
    try {
      // For now, just show a notification
      // This can be extended later to scaffold code or run scripts
      const action = await vscode.window.showInformationMessage(
        'Executing plan... 🚀',
        { modal: false },
        'View Progress',
        'Cancel'
      );

      if (action === 'View Progress') {
        vscode.window.showInformationMessage(
          'Plan execution feature is coming soon! For now, follow the steps in your generated plan manually.',
          { modal: false }
        );
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      vscode.window.showErrorMessage(`Error executing plan: ${errorMessage}`);
      console.error('Execute plan command error:', error);
    }
  });

  // Register configuration change listener to refresh planner config
  const configChangeListener = vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('layr.geminiApiKey')) {
      planner.refreshConfig();
      vscode.window.showInformationMessage('Layr configuration updated! 🔄');
    }
  });

  // Add commands to subscriptions for proper cleanup
  context.subscriptions.push(
    createPlanCommand,
    executePlanCommand,
    configChangeListener
  );

  // Show welcome message on first activation
  const hasShownWelcome = context.globalState.get('layr.hasShownWelcome', false);
  if (!hasShownWelcome) {
    showWelcomeMessage(context);
  }
}

/**
 * Show welcome message with setup instructions
 */
async function showWelcomeMessage(context: vscode.ExtensionContext) {
  const action = await vscode.window.showInformationMessage(
    'Welcome to Layr! 🎯 To get started with AI-powered planning, configure your Gemini API key.',
    'Configure API Key',
    'Use Offline Mode',
    'Learn More'
  );

  switch (action) {
    case 'Configure API Key':
      await vscode.commands.executeCommand('workbench.action.openSettings', 'layr.geminiApiKey');
      break;
    case 'Use Offline Mode':
      vscode.window.showInformationMessage(
        'You can use Layr without an API key! It will generate plans using built-in templates. Try the "Layr: Create Plan" command.'
      );
      break;
    case 'Learn More':
      vscode.env.openExternal(vscode.Uri.parse('https://makersuite.google.com/app/apikey'));
      break;
  }

  // Mark welcome as shown
  context.globalState.update('layr.hasShownWelcome', true);
}

/**
 * This method is called when the extension is deactivated
 */
export function deactivate() {
  console.log('Layr extension deactivated');
}