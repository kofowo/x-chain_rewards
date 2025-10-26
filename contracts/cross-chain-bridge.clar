;; X-Chain Rewards: Cross-Chain Reward Bridge (Stacks -> EVM)
;; Simplified educational bridge proof-of-concept
;; NOTE: For hackathons/demo use only. Not production-ready.

;; (impl-trait 'SP2J6ZY48V1H1R9E9X1EZPRG6XK8N7M8YFQ3Z0A1.trait-ownable) ;; optional if you add such a trait; kept as comment

(define-data-var admin-oracle principal tx-sender)
(define-data-var lock-timeout uint u100) ;; blocks until user can refund (demo value)
(define-constant ERR-NOT-AUTHORIZED (err u1001))
(define-constant ERR-NO-LOCK (err u1002))
(define-constant ERR-ALREADY-CLAIMED (err u1003))
(define-constant ERR-NOT-TIME (err u1004))
(define-constant ERR-BAD-AMOUNT (err u1005))

(define-map locks
  {id: uint}
  {
    sender: principal,
    amount: uint,
    recipient: (buff 48),         ;; destination chain address (ascii/hex bytes)
    target-chain: uint,           ;; e.g., 137 for Polygon
    created-at: uint,
    claimed: bool
  }
)

(define-data-var last-id uint u0)

(define-read-only (get-admin) (ok (var-get admin-oracle)))
(define-public (set-admin (p principal))
    (if (is-eq tx-sender (var-get admin-oracle))
        (begin (var-set admin-oracle p) (ok true))
        ERR-NOT-AUTHORIZED))

;; payable entry: user specifies how much they want to lock and sends that amount to the contract
(define-public (lock-stx (amount uint) (recipient (buff 48)) (target-chain uint))
  (begin
    (asserts! (> amount u0) ERR-BAD-AMOUNT)
    ;; move STX from caller into the contract to "lock"
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (var-set last-id (+ (var-get last-id) u1))
    (map-set locks
      {id: (var-get last-id)}
      {
        sender: tx-sender,
        amount: amount,
        recipient: recipient,
        target-chain: target-chain,
        created-at: block-height,
        claimed: false
      })
    (print {event: "lock", id: (var-get last-id), sender: tx-sender, amount: amount, target: target-chain, recipient: recipient})
    (ok (var-get last-id))
  )
)

;; Oracle confirms that wrapped tokens were minted on destination chain for lock id
(define-public (oracle-confirm (id uint) (dest-tx-hash (buff 66)))
  (if (is-eq tx-sender (var-get admin-oracle))
      (let
        (
          (entry (map-get? locks {id: id}))
        )
        (match entry
          lock
          (if (get claimed lock)
              ERR-ALREADY-CLAIMED
              (begin
                (map-set locks {id: id} (merge lock {claimed: true}))
                (print {event: "mint-confirmed", id: id, dest-tx: dest-tx-hash})
                (ok true)))
          ERR-NO-LOCK))
      ERR-NOT-AUTHORIZED)
)

;; If oracle never confirms and timeout passes, user can refund locked STX
(define-public (refund (id uint))
  (let (
    (entry (map-get? locks {id: id}))
  )
  (match entry
    lock
    (if (get claimed lock)
        ERR-ALREADY-CLAIMED
        (if (>= (- block-height (get created-at lock)) (var-get lock-timeout))
            (begin
              (map-set locks {id: id} (merge lock {claimed: true}))
              (try! (stx-transfer? (get amount lock) (as-contract tx-sender) (get sender lock)))
              (print {event: "refund", id: id})
              (ok true))
            ERR-NOT-TIME))
    ERR-NO-LOCK)))