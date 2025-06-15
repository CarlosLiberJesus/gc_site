<?php
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');

    if (!$email || !$message) {
        header('Location: index.html?msg=invalid');
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header('Location: index.html?msg=invalid');
        exit;
    }

    if (!$name) {
        $name = 'Geração Consciente Site';
    }

    $recaptcha_secret = ''; // Troque pela sua chave secreta
    $recaptcha_response = $_POST['g-recaptcha-response'] ?? '';

    if (!$recaptcha_response) {
        header('Location: index.html?msg=recaptcha');
        exit;
    }

    // Verifica com a Google
    $verify = file_get_contents(
        "https://www.google.com/recaptcha/api/siteverify?secret={$recaptcha_secret}&response={$recaptcha_response}"
    );
    $captcha_success = json_decode($verify);

    if (!$captcha_success->success) {
        header('Location: index.html?msg=recaptcha');
        exit;
    }


    require_once __DIR__ . '/php/class.phpmailer.php';
    require_once __DIR__ . '/php/class.smtp.php';

    //Create a new PHPMailer instance
    $mail = new PHPMailer();

    // Define os dados do servidor e tipo de conexão
    $mail->IsSMTP(); // Define que a mensagem será SMTP
    $mail->Host = "mail.geracaoconsciente.pt"; // Endereço do servidor SMTP
    $mail->SMTPAuth = true; // Usa autenticação SMTP? (opcional)
    $mail->Username = 'geral@geracaoconsciente.pt'; // Usuário do servidor SMTP
    $mail->Password = ''; // Senha do servidor SMTP

    // Define o remetente
    $mail->From = 'geral@geracaoconsciente.pt';
    $mail->FromName = $name;
    $mail->addReplyTo($email, $name);
    $mail->Subject  = "CONTACTO SITE";
    $mail->Body = htmlspecialchars($message) . "\n\n" .
                  "Email: " . htmlspecialchars($email) . "\n" .
                  "Nome: " . htmlspecialchars($name);


    // Define os destinatário(s)
    $mail->AddAddress('jesus@geracaoconsciente.pt');

    // Define os dados técnicos da Mensagem
    $mail->IsHTML(false); // Define que o e-mail será enviado como HTML
    //$mail->CharSet = 'iso-8859-1'; // Charset da mensagem (opcional)

    // Envia o e-mail
    $enviado = @$mail->Send();
    $enviado = $mail->Send();

    // Limpa os destinatários e os anexos
    $mail->ClearAllRecipients();
    $mail->ClearAttachments();

    @header('Location: index.html?msg=success');
    exit;

?>