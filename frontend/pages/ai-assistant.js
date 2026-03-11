import Layout from "../components/Layout";
import AssistantDock from "../components/AssistantDock";
import useRequireAuth from "../lib/useRequireAuth";

export default function AssistantPage() {
  useRequireAuth();

  return (
    <Layout title="AI Assistant" hideAssistantDock>
      <AssistantDock embedded title="Happy AI Workspace Assistant" />
    </Layout>
  );
}
