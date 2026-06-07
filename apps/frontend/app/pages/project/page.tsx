import MarkdownRenderBox from "~/components/md-editor/md-renderer";
import { useProjectData } from "~/hooks/project";
import { useTranslation } from "~/locales/provider";

export default function ProjectPage() {
    const { t } = useTranslation();
    const ctx = useProjectData();

    if (!ctx.projectData.description) {
        return <span className="text-center text-foreground-muted italic">{t.project.noProjectDesc}</span>;
    }

    return (
        <div className="rounded-lg bg-card-background p-card-surround">
            <MarkdownRenderBox text={ctx.projectData.description || ""} />
        </div>
    );
}
