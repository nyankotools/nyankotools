import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'well-known ポートとは何ですか？ほかのポートとの違いは？',
      answer:
        '0〜1023 番のポートで、HTTP（80）や SSH（22）など代表的なサービスに割り当てられています。Unix 系 OS では、これらのポートで待ち受けるには通常、管理者権限が必要です。1024〜49151 は登録ポート（MySQL の 3306 など）、49152〜65535 は動的・プライベートポートで、クライアントが接続時に自動で使う送信元ポートもここから選ばれます。',
    },
    {
      question: 'TCP と UDP で同じ番号のポートは同じものですか？',
      answer:
        '別のものとして扱われます。たとえば 53 番は DNS で、TCP と UDP の両方に割り当てられていますが、待ち受けるソフトウェアはプロトコルごとに別々に開きます。ファイアウォールでも、TCP の許可と UDP の許可は別に設定する必要があります。一覧のバッジで、どちらを使うかを確認できます。',
    },
    {
      question: '3000 や 5173 など、一覧に「慣例」と出るポートは何ですか？',
      answer:
        'IANA が正式に割り当てた用途ではなく、フレームワークやツールの既定値として広く使われている番号です。たとえば 3000 は Node.js や Rails、5173 は Vite の開発サーバーでよく使われます。設定で自由に変えられますし、同じ番号を別のソフトが使っていることもあるため、競合したら別の番号にしてください。',
    },
    {
      question: '25・465・587 はメール送信でどう使い分けますか？',
      answer:
        '25 番はサーバー間のメール配送用で、迷惑メール対策として一般家庭向けの回線では送信が制限されていることが多いです。メールソフトからの送信には、STARTTLS で暗号化する 587 番（Submission）か、最初から TLS で接続する 465 番を使います。どちらを使うかは、利用するメールサービスの案内に従ってください。',
    },
    {
      question:
        'データベースのポートをインターネットに公開しても大丈夫ですか？',
      answer:
        'MySQL（3306）・PostgreSQL（5432）・Redis（6379）・MongoDB（27017）などは、インターネットに直接公開しないのが基本です。無防備な状態で公開すると、攻撃や情報漏えいの原因になります。アプリと同じプライベートネットワーク内に置くか、VPN や SSH トンネル、IP 制限を通して接続し、認証も必ず有効にしてください。',
    },
  ],
  en: [
    {
      question:
        'What are well-known ports, and how do they differ from other ports?',
      answer:
        'Well-known ports are 0-1023, assigned to core services such as HTTP (80) and SSH (22). On Unix-like systems, listening on them normally requires administrator privileges. Ports 1024-49151 are registered ports (for example MySQL on 3306), and 49152-65535 are dynamic or private ports, which is where clients usually get their temporary source port.',
    },
    {
      question: 'Is a TCP port the same as a UDP port with the same number?',
      answer:
        'No, they are separate. Port 53 is assigned to DNS for both TCP and UDP, but software opens each one independently, and a firewall needs separate rules for TCP and UDP. The badges in the list show which transport a service uses.',
    },
    {
      question: 'What does "Convention" mean on ports like 3000 or 5173?',
      answer:
        'It marks numbers that IANA did not assign to that use, but which frameworks and tools widely use as defaults. For example, 3000 is common for Node.js and Rails, and 5173 for the Vite dev server. You can change them in settings, and another program may already hold the same number, so pick a different one if there is a conflict.',
    },
    {
      question: 'Which should I use for sending email: 25, 465, or 587?',
      answer:
        'Port 25 is for server-to-server delivery, and residential connections often block outbound traffic on it to fight spam. Mail clients should send through 587 (Submission, upgraded with STARTTLS) or 465 (TLS from the start). Follow whichever your mail provider documents.',
    },
    {
      question: 'Is it safe to expose a database port to the Internet?',
      answer:
        'Generally no. MySQL (3306), PostgreSQL (5432), Redis (6379), and MongoDB (27017) should not face the Internet directly, because an open database invites attacks and data leaks. Keep them on a private network or reach them through a VPN, an SSH tunnel, or IP allow-lists, and always enable authentication.',
    },
  ],
};
